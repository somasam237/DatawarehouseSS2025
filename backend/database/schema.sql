
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE protein_info (
    pdb_id VARCHAR(10) PRIMARY KEY,
    title TEXT,
    deposition_date DATE,
    release_date DATE,
    resolution DECIMAL(5,2),
    r_factor DECIMAL(5,3),
    r_free DECIMAL(5,3),
    experimental_method VARCHAR(100),
    space_group VARCHAR(50),
    unit_cell_a DECIMAL(10,3),
    unit_cell_b DECIMAL(10,3),
    unit_cell_c DECIMAL(10,3),
    unit_cell_alpha DECIMAL(5,2),
    unit_cell_beta DECIMAL(5,2),
    unit_cell_gamma DECIMAL(5,2),
    molecular_weight DECIMAL(10,2),
    sequence_length INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experimental_data (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    experimental_method VARCHAR(100),
    resolution DECIMAL(5,2),
    r_factor DECIMAL(5,3),
    r_free DECIMAL(5,3),
    temperature DECIMAL(5,2),
    ph DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ligands (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    ligand_name VARCHAR(100),
    ligand_id VARCHAR(20),
    chemical_formula VARCHAR(100),
    molecular_weight DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE macromolecules (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    molecule_name VARCHAR(100),
    molecule_type VARCHAR(50),
    chain_id VARCHAR(10),
    sequence_length INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors_funding (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    author_names TEXT,
    funding_org VARCHAR(200),
    funding_location VARCHAR(100),
    grant_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE software_used (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    software_name VARCHAR(100),
    software_purpose VARCHAR(200),
    software_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE version_history (
    id SERIAL PRIMARY KEY,
    pdb_id VARCHAR(10) REFERENCES protein_info(pdb_id),
    version_number VARCHAR(20),
    release_date DATE,
    changes_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);