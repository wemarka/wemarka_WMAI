import { supabase } from "@/lib/supabase";

/**
 * Class to track user analytics
 */
export class UserAnalyticsTracker {
  private static instance: UserAnalyticsTracker;
  private sessionId: string | null = null;
  private sessionStartTime: Date | null = null;
  private currentModule: string | null = null;
  private moduleStartTime: Date | null = null;
  private isTracking: boolean = false;

  private constructor() {}

  /**
   * Get the singleton instance of UserAnalyticsTracker
   */
  public static getInstance(): UserAnalyticsTracker {
    if (!UserAnalyticsTracker.instance) {
      UserAnalyticsTracker.instance = new UserAnalyticsTracker();
    }
    return UserAnalyticsTracker.instance;
  }

  /**
   * Initialize the tracker and start a new session
   */
  public async init(): Promise<void> {
    if (this.isTracking) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      this.sessionStartTime = new Date();
      this.isTracking = true;

      // Get device and browser info
      const deviceInfo = this.getDeviceInfo();
      const locationInfo = await this.getLocationInfo();

      // Create a new session
      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userData.user.id,
          session_start: this.sessionStartTime.toISOString(),
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          country: locationInfo.country,
          ip_address: locationInfo.ip,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating session:", error);
        this.isTracking = false;
        return;
      }

      this.sessionId = data.id;

      // Set up event listeners
      window.addEventListener("beforeunload", this.endSession.bind(this));
      document.addEventListener(
        "visibilitychange",
        this.handleVisibilityChange.bind(this),
      );

      console.log("Analytics tracking initialized");
    } catch (error) {
      console.error("Error initializing analytics tracker:", error);
      this.isTracking = false;
    }
  }

  /**
   * Track when a user enters a module
   * @param moduleName Name of the module
   */
  public trackModuleEnter(moduleName: string): void {
    if (!this.isTracking || !this.sessionId) return;

    // If already in a module, track exit first
    if (this.currentModule) {
      this.trackModuleExit();
    }

    this.currentModule = moduleName;
    this.moduleStartTime = new Date();

    // No need to insert a record yet, we'll do that on exit to calculate duration
  }

  /**
   * Track when a user exits a module
   */
  public async trackModuleExit(): Promise<void> {
    if (
      !this.isTracking ||
      !this.sessionId ||
      !this.currentModule ||
      !this.moduleStartTime
    )
      return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const now = new Date();
      const duration = Math.round(
        (now.getTime() - this.moduleStartTime.getTime()) / 1000,
      ); // in seconds

      // Only record if duration is at least 1 second
      if (duration >= 1) {
        await supabase.from("module_access").insert({
          user_id: userData.user.id,
          session_id: this.sessionId,
          module: this.currentModule,
          access_time: this.moduleStartTime.toISOString(),
          duration,
        });
      }

      this.currentModule = null;
      this.moduleStartTime = null;
    } catch (error) {
      console.error("Error tracking module exit:", error);
    }
  }

  /**
   * Track when a user uses a specific feature
   * @param moduleName Name of the module
   * @param featureName Name of the feature
   */
  public async trackFeatureUsage(
    moduleName: string,
    featureName: string,
  ): Promise<void> {
    if (!this.isTracking || !this.sessionId) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      await supabase.from("feature_usage").insert({
        user_id: userData.user.id,
        session_id: this.sessionId,
        module: moduleName,
        feature: featureName,
      });
    } catch (error) {
      console.error("Error tracking feature usage:", error);
    }
  }

  /**
   * End the current session
   */
  public async endSession(): Promise<void> {
    if (!this.isTracking || !this.sessionId || !this.sessionStartTime) return;

    try {
      // If in a module, track exit first
      if (this.currentModule) {
        await this.trackModuleExit();
      }

      const now = new Date();
      const duration = Math.round(
        (now.getTime() - this.sessionStartTime.getTime()) / 1000,
      ); // in seconds

      await supabase
        .from("user_sessions")
        .update({
          session_end: now.toISOString(),
          duration,
        })
        .eq("id", this.sessionId);

      this.sessionId = null;
      this.sessionStartTime = null;
      this.isTracking = false;

      // Remove event listeners
      window.removeEventListener("beforeunload", this.endSession.bind(this));
      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange.bind(this),
      );

      console.log("Analytics tracking ended");
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  /**
   * Handle visibility change (tab focus/blur)
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // User left the page, pause tracking
      if (this.currentModule) {
        this.trackModuleExit();
      }
    } else {
      // User returned to the page, resume tracking if we know the last module
      if (this.currentModule) {
        this.moduleStartTime = new Date();
      }
    }
  }

  /**
   * Get device and browser information
   */
  private getDeviceInfo(): { device: string; browser: string; os: string } {
    const userAgent = navigator.userAgent;
    let device = "Unknown";
    let browser = "Unknown";
    let os = "Unknown";

    // Detect device type
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      if (/iPad/i.test(userAgent)) {
        device = "Tablet";
      } else {
        device = "Mobile";
      }
    } else {
      device = "Desktop";
    }

    // Detect browser
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
      browser = "Chrome";
    } else if (/Firefox/i.test(userAgent)) {
      browser = "Firefox";
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      browser = "Safari";
    } else if (/Edg/i.test(userAgent)) {
      browser = "Edge";
    } else if (/MSIE|Trident/i.test(userAgent)) {
      browser = "Internet Explorer";
    }

    // Detect OS
    if (/Windows/i.test(userAgent)) {
      os = "Windows";
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      os = "MacOS";
    } else if (/Linux/i.test(userAgent)) {
      os = "Linux";
    } else if (/Android/i.test(userAgent)) {
      os = "Android";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      os = "iOS";
    }

    return { device, browser, os };
  }

  /**
   * Get location information (country and IP)
   */
  private async getLocationInfo(): Promise<{ country: string; ip: string }> {
    try {
      // Use a free IP geolocation service
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return {
        country: data.country_name || "Unknown",
        ip: data.ip || "Unknown",
      };
    } catch (error) {
      console.error("Error getting location info:", error);
      return { country: "Unknown", ip: "Unknown" };
    }
  }
}

// Export a singleton instance
export const userAnalyticsTracker = UserAnalyticsTracker.getInstance();
