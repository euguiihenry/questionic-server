import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js'
import { create } from 'domain';

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(cors());

/* Connect to Database:
================================================================================*/
    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

/* Getting 10 Questions per GET request:
================================================================================*/
    app.get('/get-questions', async (req, res) => {
        const { subject_id } = req.body;

        const { data, error } = await supabase.
            from('questions')
            .select('*')
            .eq('subject_id', subject_id)
            .limit(10);

        if (error) {
            res.status(500).json(error);
            console.error(error);
        } else {
            res.json(data);
        }
    });

/* Get All Subjects from database:
================================================================================*/
    app.get('/get-subjects', async (req, res) => {
        const { data, error } = await supabase
        .from('subjects')
        .select('*');

        if (error) {
            res.status(500).json(error);
            console.error(error);
        } else {
            res.json(data);
        }        
    });

/* Inserting a new question into the DB:
================================================================================*/
    app.post('/post-question', async (req, res) => {
        const { question, options, correct_answer, explanation, subject_id } = req.body;

        const { data, error } = await supabase
            .from('questions')
            .insert([{ question, options, correct_answer, explanation, subject_id }])
            .select()

        if (error) {
            res.status(500).json(error);
            console.error(error);
        } else {
            res.status(201).json(data);
        }
    });

/* Inserting new subject into the DB:
================================================================================*/
    app.post('/post-subject', async (req, res) => {
        const postSubjectObj: postSubject = req.body;
        console.log(postSubjectObj);

        const { data, error } = await supabase
                .from('subjects')
                .insert(postSubjectObj)
                .select()
        

        if (error) {
            res.status(500).json(error);
            console.error(error);
        } else {
            res.status(201).json(data);
        }
    });

/* App Listening:
================================================================================*/
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });


interface postSubject {
    subjectBody: string;
    codeBody: string;
}
