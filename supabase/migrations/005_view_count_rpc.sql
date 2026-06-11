CREATE OR REPLACE FUNCTION increment_view_count(project_id UUID)
RETURNS VOID AS $$
  UPDATE projects SET view_count = view_count + 1 WHERE id = project_id;
$$ LANGUAGE SQL SECURITY DEFINER;
