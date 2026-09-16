-- Schema de base de donnees — Caixa Banque Pologne
-- Compatible MySQL 8 / MariaDB 10.x

-- ============================================================
-- Administration
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(191) NOT NULL,
  role ENUM('super_admin','admin','agent') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Clients bancaires
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(191) NOT NULL,
  last_name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(64),
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(191),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Pologne',
  id_type ENUM('carte_identite','passeport','permis_conduire'),
  id_number VARCHAR(100),
  status ENUM('actif','inactif','bloque','en_attente') NOT NULL DEFAULT 'en_attente',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Comptes bancaires
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_number VARCHAR(26) NOT NULL UNIQUE,
  client_id INT NOT NULL,
  account_type ENUM('courant','epargne','professionnel','jeune') NOT NULL DEFAULT 'courant',
  label VARCHAR(100),
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'PLN',
  status ENUM('actif','bloque','ferme') NOT NULL DEFAULT 'actif',
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES bank_clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Transactions
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  type ENUM('credit','debit') NOT NULL,
  category ENUM('virement_entrant','virement_sortant','prelevement','carte','depot','retrait','frais','interet','remboursement_pret') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description VARCHAR(500),
  counterparty VARCHAR(191),
  reference VARCHAR(100),
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Cartes bancaires
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  client_id INT NOT NULL,
  card_number_last4 CHAR(4) NOT NULL,
  card_type ENUM('visa_debit','visa_classic','visa_gold','visa_platinum','mastercard') NOT NULL,
  expiry_date DATE NOT NULL,
  status ENUM('active','bloquee','expiree','en_fabrication') NOT NULL DEFAULT 'en_fabrication',
  monthly_limit DECIMAL(10,2) NOT NULL DEFAULT 2000.00,
  contactless_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  online_payment_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES bank_clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Beneficiaires
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_beneficiaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  label VARCHAR(191) NOT NULL,
  beneficiary_name VARCHAR(191) NOT NULL,
  iban VARCHAR(34) NOT NULL,
  bic VARCHAR(11),
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES bank_clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Prets
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  loan_type ENUM('immobilier','consommation','auto','professionnel','etudiant') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  duration_months INT NOT NULL,
  monthly_payment DECIMAL(10,2) NOT NULL,
  remaining_amount DECIMAL(15,2) NOT NULL,
  status ENUM('en_cours','demande','approuve','refuse','rembourse') NOT NULL DEFAULT 'demande',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES bank_clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Messagerie interne
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sender ENUM('client','banque') NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES bank_clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS bank_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info','alerte','securite','promotion') NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES bank_clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
