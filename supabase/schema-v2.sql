-- ==========================================================
-- ZeroToBCS Database Schema v2
-- Professional Architecture
-- ==========================================================

create extension if not exists "pgcrypto";

-- ==========================================================
-- EXAMS
-- ==========================================================

create table if not exists exams (

    id uuid primary key default gen_random_uuid(),

    code text unique not null,

    name text not null,

    created_at timestamptz default now()

);

-- ==========================================================
-- SUBJECTS
-- ==========================================================

create table if not exists subjects (

    id uuid primary key default gen_random_uuid(),

    exam_id uuid references exams(id) on delete cascade,

    name text not null,

    icon text,

    sort_order int default 0,

    created_at timestamptz default now()

);

-- ==========================================================
-- UNITS
-- ==========================================================

create table if not exists units (

    id uuid primary key default gen_random_uuid(),

    subject_id uuid references subjects(id) on delete cascade,

    name text not null,

    sort_order int default 0,

    created_at timestamptz default now()

);

-- ==========================================================
-- TOPICS
-- ==========================================================

create table if not exists topics (

    id uuid primary key default gen_random_uuid(),

    unit_id uuid references units(id) on delete cascade,

    name text not null,

    sort_order int default 0,

    created_at timestamptz default now()

);

-- ==========================================================
-- SUB TOPICS
-- ==========================================================

create table if not exists sub_topics (

    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    name text not null,

    sort_order int default 0,

    created_at timestamptz default now()

);
-- ==========================================================
-- QUESTIONS
-- ==========================================================

create table if not exists questions (

    id uuid primary key default gen_random_uuid(),

    exam_id uuid references exams(id),

    subject_id uuid references subjects(id),

    unit_id uuid references units(id),

    topic_id uuid references topics(id),

    sub_topic_id uuid references sub_topics(id),

    question_text text not null,

    difficulty text default 'Medium',

    marks numeric default 1,

    negative_marks numeric default 0.25,

    source text,

    source_year int,

    language text default 'English',

    status text default 'draft',

    explanation_id uuid,

    created_by uuid,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);

-- ==========================================================
-- QUESTION OPTIONS
-- ==========================================================

create table if not exists question_options (

    id uuid primary key default gen_random_uuid(),

    question_id uuid references questions(id) on delete cascade,

    option_label text not null,

    option_text text not null,

    is_correct boolean default false,

    created_at timestamptz default now()

);

-- ==========================================================
-- QUESTION EXPLANATIONS
-- ==========================================================

create table if not exists question_explanations (

    id uuid primary key default gen_random_uuid(),

    question_id uuid unique references questions(id) on delete cascade,

    explanation text,

    memory_trick text,

    common_mistake text,

    reference_book text,

    ai_explanation text,

    created_at timestamptz default now()

);
-- ==========================================================
-- ZeroToBCS Final Database Architecture
-- Version : 1.0
-- Scope : Bangladesh Government Job Preparation Platform
-- ==========================================================

/*

==========================
MODULE 01
==========================

organizations

↓

exams

↓

subjects

↓

units

↓

topics

↓

sub_topics

↓

questions

↓

question_options

↓

question_explanations


==========================
MODULE 02
==========================

user_profiles

↓

bookmarks

↓

mistake_notebook

↓

practice_history

↓

practice_answers

↓

mock_history

↓

mock_answers


==========================
MODULE 03
==========================

user_statistics

↓

subject_statistics

↓

topic_statistics

↓

question_statistics


==========================
MODULE 04
==========================

study_plans

↓

daily_tasks

↓

revision_queue

↓

ai_recommendations


==========================
MODULE 05
==========================

admin_users

↓

question_import_logs

↓

question_edit_history

↓

system_logs

*/