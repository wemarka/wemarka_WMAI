-- Fix bilingual descriptions for support_tickets table
-- This migration adds conditional checks for column existence before adding comments

DO $$
BEGIN
  -- Check if support_tickets table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    -- Add comments to columns only if they exist
    
    -- Table comment
    COMMENT ON TABLE support_tickets IS 'Support tickets submitted by users | تذاكر الدعم المقدمة من المستخدمين';
    
    -- Column comments - only if the column exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'id') THEN
      COMMENT ON COLUMN support_tickets.id IS 'Unique identifier for the support ticket | معرف فريد لتذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN support_tickets.user_id IS 'ID of the user who created the ticket | معرف المستخدم الذي أنشأ التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'subject') THEN
      COMMENT ON COLUMN support_tickets.subject IS 'Subject of the support ticket | موضوع تذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'description') THEN
      COMMENT ON COLUMN support_tickets.description IS 'Detailed description of the issue | وصف مفصل للمشكلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'status') THEN
      COMMENT ON COLUMN support_tickets.status IS 'Current status of the ticket (open, in_progress, resolved, closed) | الحالة الحالية للتذكرة (مفتوحة، قيد التقدم، تم حلها، مغلقة)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'priority') THEN
      COMMENT ON COLUMN support_tickets.priority IS 'Priority level of the ticket (low, medium, high, urgent) | مستوى أولوية التذكرة (منخفض، متوسط، مرتفع، عاجل)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'category') THEN
      COMMENT ON COLUMN support_tickets.category IS 'Category of the support issue | فئة مشكلة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'assigned_to') THEN
      COMMENT ON COLUMN support_tickets.assigned_to IS 'ID of the staff member assigned to the ticket | معرف الموظف المكلف بالتذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN support_tickets.created_at IS 'Timestamp when the ticket was created | الطابع الزمني عند إنشاء التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN support_tickets.updated_at IS 'Timestamp when the ticket was last updated | الطابع الزمني عند آخر تحديث للتذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolved_at') THEN
      COMMENT ON COLUMN support_tickets.resolved_at IS 'Timestamp when the ticket was resolved | الطابع الزمني عند حل التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolution_notes') THEN
      COMMENT ON COLUMN support_tickets.resolution_notes IS 'Notes about how the issue was resolved | ملاحظات حول كيفية حل المشكلة';
    END IF;
  END IF;
  
  -- Add similar conditional checks for other tables and columns as needed
  
 END;
$$;