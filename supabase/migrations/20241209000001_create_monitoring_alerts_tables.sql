-- Create monitoring_alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  metric VARCHAR NOT NULL,
  threshold FLOAT NOT NULL,
  comparison VARCHAR NOT NULL CHECK (comparison IN ('gt', 'lt', 'eq', 'gte', 'lte')),
  severity VARCHAR NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  notification_channels JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create alert_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS alert_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES monitoring_alerts(id) ON DELETE CASCADE,
  alert_name VARCHAR NOT NULL,
  metric VARCHAR NOT NULL,
  current_value FLOAT NOT NULL,
  threshold FLOAT NOT NULL,
  comparison VARCHAR NOT NULL,
  severity VARCHAR NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  message TEXT NOT NULL,
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_metric ON monitoring_alerts(metric);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_enabled ON monitoring_alerts(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_alert_id ON alert_notifications(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_triggered_at ON alert_notifications(triggered_at);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_acknowledged ON alert_notifications(acknowledged);

-- Add table descriptions
COMMENT ON TABLE monitoring_alerts IS 'Stores alert configurations for system monitoring';
COMMENT ON TABLE alert_notifications IS 'Stores triggered alert notifications';

-- Add column descriptions for monitoring_alerts
COMMENT ON COLUMN monitoring_alerts.id IS 'Unique identifier for the alert';
COMMENT ON COLUMN monitoring_alerts.name IS 'Name of the alert';
COMMENT ON COLUMN monitoring_alerts.description IS 'Description of what the alert monitors';
COMMENT ON COLUMN monitoring_alerts.metric IS 'The metric to monitor (e.g., cpu_usage, memory_usage)';
COMMENT ON COLUMN monitoring_alerts.threshold IS 'The threshold value that triggers the alert';
COMMENT ON COLUMN monitoring_alerts.comparison IS 'Comparison operator: gt (>), lt (<), eq (=), gte (>=), lte (<=)';
COMMENT ON COLUMN monitoring_alerts.severity IS 'Severity level: low, medium, high, critical';
COMMENT ON COLUMN monitoring_alerts.enabled IS 'Whether the alert is active';
COMMENT ON COLUMN monitoring_alerts.notification_channels IS 'JSON array of notification channels (e.g., email, slack)';

-- Add column descriptions for alert_notifications
COMMENT ON COLUMN alert_notifications.id IS 'Unique identifier for the notification';
COMMENT ON COLUMN alert_notifications.alert_id IS 'Reference to the alert configuration';
COMMENT ON COLUMN alert_notifications.alert_name IS 'Name of the alert that was triggered';
COMMENT ON COLUMN alert_notifications.metric IS 'The metric that triggered the alert';
COMMENT ON COLUMN alert_notifications.current_value IS 'The value of the metric when the alert was triggered';
COMMENT ON COLUMN alert_notifications.threshold IS 'The threshold value that was exceeded';
COMMENT ON COLUMN alert_notifications.comparison IS 'The comparison operator used';
COMMENT ON COLUMN alert_notifications.severity IS 'Severity level of the alert';
COMMENT ON COLUMN alert_notifications.triggered_at IS 'When the alert was triggered';
COMMENT ON COLUMN alert_notifications.message IS 'Alert message';
COMMENT ON COLUMN alert_notifications.acknowledged IS 'Whether the alert has been acknowledged';
COMMENT ON COLUMN alert_notifications.acknowledged_by IS 'User who acknowledged the alert';
COMMENT ON COLUMN alert_notifications.acknowledged_at IS 'When the alert was acknowledged';

-- Add tables to realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

-- Check if tables exist in the publication
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'monitoring_alerts'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE monitoring_alerts;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'alert_notifications'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE alert_notifications;
  END IF;
END
$$;

-- Insert sample alerts
INSERT INTO monitoring_alerts (name, description, metric, threshold, comparison, severity, enabled)
VALUES
  ('High CPU Usage', 'Alert when CPU usage exceeds 80%', 'cpu_usage', 80, 'gt', 'high', true),
  ('Low System Health', 'Alert when system health drops below 70%', 'system_health', 70, 'lt', 'critical', true),
  ('High Memory Usage', 'Alert when memory usage exceeds 85%', 'memory_usage', 85, 'gt', 'medium', true),
  ('High Disk Usage', 'Alert when disk usage exceeds 90%', 'disk_usage', 90, 'gt', 'high', true),
  ('Slow Query Performance', 'Alert when average query time exceeds 500ms', 'query_performance', 500, 'gt', 'medium', true),
  ('High Error Rate', 'Alert when error rate exceeds 5%', 'error_rate', 5, 'gt', 'high', true)
ON CONFLICT (id) DO NOTHING;
