export interface Offer {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  posted_at: Date;
  company: string;
  link: string;
  content: string;
  recommendations?: string;
  cv_name?: string;
  cv_link?: string;
  job_title?: string;
  company_description?: string;
}
