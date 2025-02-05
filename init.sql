CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    posted_at TIMESTAMP NOT NULL,
    company TEXT NOT NULL,
    link TEXT NOT NULL,
    content TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    cv_name TEXT,
    cv_link TEXT,
    job_title TEXT,
    company_description TEXT
);
