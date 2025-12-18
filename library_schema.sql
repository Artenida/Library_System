--
-- PostgreSQL database dump
--

\restrict vcf7e4vnencY3Sb2wUOyUVMnzMQ0YgmyPZBMLLrJysBAmDnk6jC3OaFjhklOjfh

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-18 13:49:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16388)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16480)
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    birth_year integer
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16488)
-- Name: book_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_authors (
    book_id uuid NOT NULL,
    author_id uuid NOT NULL
);


ALTER TABLE public.book_authors OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16463)
-- Name: book_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_genres (
    book_id uuid NOT NULL,
    genre_id uuid NOT NULL
);


ALTER TABLE public.book_genres OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16440)
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    published_date date,
    pages integer,
    price numeric(10,2),
    cover_image_url character varying(255),
    state character varying(20) DEFAULT 'free'::character varying NOT NULL,
    is_active boolean DEFAULT true,
    CONSTRAINT books_state_check CHECK (((state)::text = ANY ((ARRAY['free'::character varying, 'borrowed'::character varying, 'deleted'::character varying])::text[])))
);


ALTER TABLE public.books OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16453)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16543)
-- Name: user_books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_books (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    book_id uuid NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    from_date timestamp with time zone,
    to_date timestamp with time zone,
    CONSTRAINT user_books_status_check CHECK (((status)::text = ANY ((ARRAY['reading'::character varying, 'completed'::character varying, 'returned'::character varying, 'deleted'::character varying])::text[])))
);


ALTER TABLE public.user_books OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16426)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(10) DEFAULT 'user'::character varying NOT NULL,
    CONSTRAINT valid_role CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 16480)
-- Dependencies: 224
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authors (id, name, birth_year) FROM stdin;
3af3f2c0-e8f5-4c11-a161-6b23ff5eee38	Stephen King	1930
6f9895c2-b6e7-4b12-ba69-06c79b8be329	Brandon Sanderson	1999
c73a65b1-2c29-4119-b913-9415360931fd	George Orwell	1944
0df5d211-ad49-4292-87d8-edbc1ddb05f2	John Mercer	1980
731538ef-70fb-40a0-88fd-7a0374b6cf67	testtt	2025
8f1806e6-3f74-4069-b3f1-cf2272beaa33	J.K. Rowling	1965
b9c29ccf-9722-4cad-b402-7fc0e4152061	Isaac Asimov	1920
eb2595a0-6b8b-4b64-9678-d689bfbdeb01	Agatha Christie	1890
6fb40e75-9429-4094-b326-558feb73bb0d	Jane Austen	1775
c984956b-5a00-4b1a-b20a-217843ae6ee1	Yuval Noah Harari	1976
bb73279f-eeeb-4773-b8f2-259eeb81ca01	Joannee Rowling	1965
\.


--
-- TOC entry 5007 (class 0 OID 16488)
-- Dependencies: 225
-- Data for Name: book_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_authors (book_id, author_id) FROM stdin;
e08e2202-b57c-4047-b8db-1ac19819cda7	0df5d211-ad49-4292-87d8-edbc1ddb05f2
6a7b1438-5b1a-4bf3-9a05-2d86adb5f5ff	731538ef-70fb-40a0-88fd-7a0374b6cf67
67e98ead-a557-4f2e-bb79-7660bc3b1a65	0df5d211-ad49-4292-87d8-edbc1ddb05f2
ca681079-4e24-4cb3-a0b1-08006dfbde00	c73a65b1-2c29-4119-b913-9415360931fd
55a2dfdf-521c-4100-874a-0ec0b77e4215	6f9895c2-b6e7-4b12-ba69-06c79b8be329
55a2dfdf-521c-4100-874a-0ec0b77e4215	bb73279f-eeeb-4773-b8f2-259eeb81ca01
e0a6cdf2-4824-4d15-86e1-31020e44d6a9	731538ef-70fb-40a0-88fd-7a0374b6cf67
dce79e09-9de8-4c62-ac33-1a7be1176d88	c73a65b1-2c29-4119-b913-9415360931fd
dce79e09-9de8-4c62-ac33-1a7be1176d88	bb73279f-eeeb-4773-b8f2-259eeb81ca01
d2c48b76-3f12-4bae-a6d4-30990f23b094	6f9895c2-b6e7-4b12-ba69-06c79b8be329
8fab9454-87f4-4b55-a84d-b6847c7c3726	3af3f2c0-e8f5-4c11-a161-6b23ff5eee38
4448b4e5-7cc8-4ba6-933e-ad972f73178b	b9c29ccf-9722-4cad-b402-7fc0e4152061
29681fcf-4185-4480-8685-14d9939ef15c	8f1806e6-3f74-4069-b3f1-cf2272beaa33
b0385ed4-844c-48da-88ce-bf790b82d7ae	eb2595a0-6b8b-4b64-9678-d689bfbdeb01
18c0edba-5a55-475b-b84a-1279ea497d6b	6fb40e75-9429-4094-b326-558feb73bb0d
decaaa51-03d3-4a61-8f04-9341d10c53b2	0df5d211-ad49-4292-87d8-edbc1ddb05f2
483c18b1-9868-42e3-9bdb-f58e0d82e887	c984956b-5a00-4b1a-b20a-217843ae6ee1
\.


--
-- TOC entry 5005 (class 0 OID 16463)
-- Dependencies: 223
-- Data for Name: book_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_genres (book_id, genre_id) FROM stdin;
e08e2202-b57c-4047-b8db-1ac19819cda7	360716ae-fa02-4726-b2ec-02fe493161e6
6a7b1438-5b1a-4bf3-9a05-2d86adb5f5ff	5304bda5-7f73-4585-94fe-d7b655eef5df
67e98ead-a557-4f2e-bb79-7660bc3b1a65	360716ae-fa02-4726-b2ec-02fe493161e6
ca681079-4e24-4cb3-a0b1-08006dfbde00	1d30224c-e5e8-4da6-80cd-6ee253c43cc5
55a2dfdf-521c-4100-874a-0ec0b77e4215	68f45a1f-0acc-4148-9aa9-c34e8f5b080f
55a2dfdf-521c-4100-874a-0ec0b77e4215	1d30224c-e5e8-4da6-80cd-6ee253c43cc5
e0a6cdf2-4824-4d15-86e1-31020e44d6a9	5304bda5-7f73-4585-94fe-d7b655eef5df
dce79e09-9de8-4c62-ac33-1a7be1176d88	5304bda5-7f73-4585-94fe-d7b655eef5df
d2c48b76-3f12-4bae-a6d4-30990f23b094	68f45a1f-0acc-4148-9aa9-c34e8f5b080f
8fab9454-87f4-4b55-a84d-b6847c7c3726	95a58946-0507-4b52-82e5-e463fc028d61
4448b4e5-7cc8-4ba6-933e-ad972f73178b	5304bda5-7f73-4585-94fe-d7b655eef5df
29681fcf-4185-4480-8685-14d9939ef15c	360716ae-fa02-4726-b2ec-02fe493161e6
b0385ed4-844c-48da-88ce-bf790b82d7ae	360716ae-fa02-4726-b2ec-02fe493161e6
18c0edba-5a55-475b-b84a-1279ea497d6b	1d30224c-e5e8-4da6-80cd-6ee253c43cc5
decaaa51-03d3-4a61-8f04-9341d10c53b2	360716ae-fa02-4726-b2ec-02fe493161e6
483c18b1-9868-42e3-9bdb-f58e0d82e887	95a58946-0507-4b52-82e5-e463fc028d61
\.


--
-- TOC entry 5003 (class 0 OID 16440)
-- Dependencies: 221
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (id, title, description, published_date, pages, price, cover_image_url, state, is_active) FROM stdin;
decaaa51-03d3-4a61-8f04-9341d10c53b2	The Silent Library	A mystery novel about hidden secrets inside an old library.	2021-09-14	324	19.99	https://example.com/covers/silent-library.jpg	free	t
ca681079-4e24-4cb3-a0b1-08006dfbde00	Hello	This is a test	2025-12-16	23	10.00		free	t
6a7b1438-5b1a-4bf3-9a05-2d86adb5f5ff	Test	This is a test	2025-12-16	12	12.00		deleted	f
55a2dfdf-521c-4100-874a-0ec0b77e4215	Admin Test	Admin test	2025-12-17	12	10.00		deleted	f
e0a6cdf2-4824-4d15-86e1-31020e44d6a9	Test	This is a test	2025-12-12	12	12.00		borrowed	t
dce79e09-9de8-4c62-ac33-1a7be1176d88	Book_Updated	A mystery novel about hidden secrets inside an old library.	2021-09-01	325	29.99	https://example.com/covers/silent-library.jpg	borrowed	t
67e98ead-a557-4f2e-bb79-7660bc3b1a65	Book Mistery	A mystery novel about hidden secrets inside an old library.	2021-09-15	324	19.99	https://example.com/covers/silent-library.jpg	borrowed	t
e08e2202-b57c-4047-b8db-1ac19819cda7	The Silent Library - Updated by Adminn	Updated description: secrets and mysteries in the old library.	2021-09-05	330	22.50	https://example.com/covers/silent-library-updated.jpg	free	t
d2c48b76-3f12-4bae-a6d4-30990f23b094	Mistborn	A crew attempts to overthrow a tyrannical ruler.	2006-07-06	539	21.00	mistborn.jpg	borrowed	t
8fab9454-87f4-4b55-a84d-b6847c7c3726	The Shining	A writer faces supernatural horrors in a hotel.	1977-01-18	447	18.00	shining.jpg	borrowed	t
4448b4e5-7cc8-4ba6-933e-ad972f73178b	Foundation	A science fiction novel about the fall of a galactic empire.	1951-05-31	255	19.99	https://example.com/foundation.jpg	free	t
b0385ed4-844c-48da-88ce-bf790b82d7ae	Murder on the Orient Express	A famous mystery novel featuring Hercule Poirot.	1934-01-01	256	14.99	https://example.com/orientexpress.jpg	free	t
18c0edba-5a55-475b-b84a-1279ea497d6b	Pride and Prejudice	A classic romance novel set in the early 19th century.	1813-01-27	432	17.99	https://example.com/prideprejudice.jpg	free	t
483c18b1-9868-42e3-9bdb-f58e0d82e887	Sapiens: A Brief History of Humankind	A non-fiction book exploring human history.	2010-12-31	498	29.99	https://example.com/sapiens.jpg	free	t
29681fcf-4185-4480-8685-14d9939ef15c	Harry Potter and the Sorcerers Stone	The first book in the Harry Potter series.	1997-06-25	309	24.99	https://example.com/harrypotter1.jpg	borrowed	t
\.


--
-- TOC entry 5004 (class 0 OID 16453)
-- Dependencies: 222
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (id, name) FROM stdin;
360716ae-fa02-4726-b2ec-02fe493161e6	Mystery
95a58946-0507-4b52-82e5-e463fc028d61	Thriller
5304bda5-7f73-4585-94fe-d7b655eef5df	Science Fiction
1d30224c-e5e8-4da6-80cd-6ee253c43cc5	Romance
68f45a1f-0acc-4148-9aa9-c34e8f5b080f	Fantasy
\.


--
-- TOC entry 5008 (class 0 OID 16543)
-- Dependencies: 226
-- Data for Name: user_books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_books (id, user_id, book_id, status, created_at, from_date, to_date) FROM stdin;
7e4b111f-7a3e-46af-937e-f4d459258b87	04f40cde-4b92-480d-aed4-157416df83ae	dce79e09-9de8-4c62-ac33-1a7be1176d88	deleted	2025-12-15 10:24:52.430562	2025-12-15 10:24:52.415+01	\N
976f590c-802b-41e6-b25c-299003766361	04f40cde-4b92-480d-aed4-157416df83ae	dce79e09-9de8-4c62-ac33-1a7be1176d88	deleted	2025-12-14 20:25:00.340818	2025-12-14 20:25:00.329+01	\N
77089eb5-813b-4e3b-b421-97da58931f6c	75bf94c2-1be3-492d-891d-342811351871	decaaa51-03d3-4a61-8f04-9341d10c53b2	deleted	2025-12-14 20:27:49.170258	2025-12-14 20:27:49.016+01	\N
898612b6-4edc-4cfc-a5d8-40b7ab37862c	75bf94c2-1be3-492d-891d-342811351871	e08e2202-b57c-4047-b8db-1ac19819cda7	deleted	2025-12-14 20:28:27.351862	2025-12-14 20:28:27.343+01	\N
69e722ea-e0c0-4b69-8dea-2a00132dfdea	04f40cde-4b92-480d-aed4-157416df83ae	e08e2202-b57c-4047-b8db-1ac19819cda7	deleted	2025-12-14 20:25:20.105291	2025-12-14 20:25:19.968+01	\N
d98a1d0d-1a67-43a8-af82-27f594301cd0	04f40cde-4b92-480d-aed4-157416df83ae	dce79e09-9de8-4c62-ac33-1a7be1176d88	deleted	2025-12-15 10:26:36.966873	2025-12-15 10:26:36.948+01	\N
72ad4ff9-5d03-4dc4-8862-e2b9cf63f0af	75bf94c2-1be3-492d-891d-342811351871	d2c48b76-3f12-4bae-a6d4-30990f23b094	deleted	2025-12-15 10:26:57.90309	2025-12-15 10:26:57.896+01	\N
cf1e9201-cdf6-40d4-8319-e6d503bfa980	75bf94c2-1be3-492d-891d-342811351871	67e98ead-a557-4f2e-bb79-7660bc3b1a65	reading	2025-12-18 09:08:31.448928	2025-12-18 09:08:31.438+01	\N
f1d67806-5908-4217-8201-34c1086c3476	04f40cde-4b92-480d-aed4-157416df83ae	8fab9454-87f4-4b55-a84d-b6847c7c3726	returned	2025-12-16 22:44:26.505003	2025-12-16 22:44:26.497+01	\N
09499c0f-cfca-4116-aa2f-07b618717264	04f40cde-4b92-480d-aed4-157416df83ae	e0a6cdf2-4824-4d15-86e1-31020e44d6a9	reading	2025-12-16 22:44:21.25653	2025-12-16 22:44:21.245+01	\N
f6fdc483-8311-4ad0-8ed1-351ecfe17027	75bf94c2-1be3-492d-891d-342811351871	dce79e09-9de8-4c62-ac33-1a7be1176d88	completed	2025-12-15 10:27:41.112414	2025-12-15 10:27:41.106+01	\N
6e507414-6796-4408-82c6-9821b6c304f9	04f40cde-4b92-480d-aed4-157416df83ae	d2c48b76-3f12-4bae-a6d4-30990f23b094	completed	2025-12-18 09:29:45.078079	2025-12-18 09:29:45.07+01	\N
8745d2bc-dc7f-44ad-b043-771bbdf86f8e	75bf94c2-1be3-492d-891d-342811351871	8fab9454-87f4-4b55-a84d-b6847c7c3726	reading	2025-12-18 09:09:11.993072	2025-12-18 09:09:11.987+01	\N
5c3c103e-91a3-42bc-935e-4a0ba84dc6c9	53aceb2a-55cb-4d96-b7c0-6f0b43440da4	29681fcf-4185-4480-8685-14d9939ef15c	reading	2025-12-18 12:11:23.275143	2025-01-10 00:00:00+01	2025-01-20 00:00:00+01
\.


--
-- TOC entry 5002 (class 0 OID 16426)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, role) FROM stdin;
75bf94c2-1be3-492d-891d-342811351871	john_dev	john@example.com	$2b$10$7cShpD5DpK4aM36zzoYrDOMBbB/b2M4AAltVuDz1u6AM60oJErWY6	user
04f40cde-4b92-480d-aed4-157416df83ae	maria_dev	maria@example.com	$2b$10$AxBKLKiv6ssirHHDcGvO4uqJU542eASHR2ZOHuzSh5wjlPXhbiXq.	user
e9ef955e-6815-4097-a8a1-10ea75c6830f	admin	admin@example.com	$2b$10$4gti9syzJDXR7Y7Vmlgvle9GJApFvqtTgtBQ0MJQvP.sid65hIYCm	admin
4584e0d5-22c8-4061-b50e-ad6e7b2a4730	admin_test	admin_test@example.com	$2b$10$7tLQJcty13457YCm4gmGjeuJaGP6FuIO7gQM5wkoF8l.k9isBFk9.	admin
9828792a-9210-4e0c-8371-8babf2f9f681	test1	test1@example.com	$2b$10$OkcGPFQnQU4NHUCFhiQzAOCqfyXJxwnhbiCSL6bg53xfFLT.OpKlq	user
c00f088e-1c53-4a2a-913f-e2c7a7fbac03	test2	test2@example.com	$2b$10$XgSRKOVMVTARFHZvxxQVdeZZdA7a50BgkMFDJyE2XH2mNACgGL0ba	user
53aceb2a-55cb-4d96-b7c0-6f0b43440da4	angel_dev	angel@example.com	$2b$10$QPG01paTXuwt4tJBFWSjhuTHgki4X8OJBzGq7W1MP/RwBJWjdLFI6	user
\.


--
-- TOC entry 4843 (class 2606 OID 16487)
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- TOC entry 4845 (class 2606 OID 16494)
-- Name: book_authors book_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_authors
    ADD CONSTRAINT book_authors_pkey PRIMARY KEY (book_id, author_id);


--
-- TOC entry 4841 (class 2606 OID 16469)
-- Name: book_genres book_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT book_genres_pkey PRIMARY KEY (book_id, genre_id);


--
-- TOC entry 4835 (class 2606 OID 16452)
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 16462)
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- TOC entry 4839 (class 2606 OID 16460)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 16554)
-- Name: user_books user_books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_books
    ADD CONSTRAINT user_books_pkey PRIMARY KEY (id);


--
-- TOC entry 4829 (class 2606 OID 16439)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4831 (class 2606 OID 16435)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4833 (class 2606 OID 16437)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4846 (class 1259 OID 16568)
-- Name: one_active_user_per_book; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX one_active_user_per_book ON public.user_books USING btree (book_id) WHERE ((status)::text = ANY ((ARRAY['reading'::character varying, 'completed'::character varying])::text[]));


--
-- TOC entry 4851 (class 2606 OID 16500)
-- Name: book_authors book_authors_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_authors
    ADD CONSTRAINT book_authors_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- TOC entry 4852 (class 2606 OID 16495)
-- Name: book_authors book_authors_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_authors
    ADD CONSTRAINT book_authors_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 16470)
-- Name: book_genres book_genres_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT book_genres_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- TOC entry 4850 (class 2606 OID 16475)
-- Name: book_genres book_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_genres
    ADD CONSTRAINT book_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 16560)
-- Name: user_books fk_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_books
    ADD CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- TOC entry 4854 (class 2606 OID 16555)
-- Name: user_books fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_books
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-12-18 13:49:06

--
-- PostgreSQL database dump complete
--

\unrestrict vcf7e4vnencY3Sb2wUOyUVMnzMQ0YgmyPZBMLLrJysBAmDnk6jC3OaFjhklOjfh

