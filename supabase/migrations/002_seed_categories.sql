INSERT INTO categories (slug, name_th, name_en) VALUES
  ('tools', 'เครื่องมือ', 'Tools'),
  ('education', 'การศึกษา', 'Education'),
  ('business', 'ธุรกิจ', 'Business'),
  ('finance', 'การเงิน', 'Finance'),
  ('food', 'อาหาร', 'Food & Lifestyle'),
  ('health', 'สุขภาพ', 'Health'),
  ('entertainment', 'บันเทิง', 'Entertainment'),
  ('productivity', 'ประสิทธิภาพ', 'Productivity'),
  ('creative', 'ความคิดสร้างสรรค์', 'Creative'),
  ('ecommerce', 'อีคอมเมิร์ซ', 'E-Commerce'),
  ('social', 'สังคม', 'Social'),
  ('travel', 'ท่องเที่ยว', 'Travel'),
  ('real-estate', 'อสังหาริมทรัพย์', 'Real Estate'),
  ('hr', 'ทรัพยากรบุคคล', 'HR & Recruitment'),
  ('other', 'อื่นๆ', 'Other')
ON CONFLICT (slug) DO NOTHING;
