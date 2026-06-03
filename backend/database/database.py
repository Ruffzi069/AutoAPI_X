"""
Database initialization and management for AutoAPI-X
"""

import sqlite3
import os
from datetime import datetime
from config.config import Config

def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with required tables"""
    
    # Ensure database directory exists
    os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create vehicles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vin TEXT UNIQUE NOT NULL,
            owner TEXT NOT NULL,
            battery INTEGER DEFAULT 100,
            doors_status TEXT DEFAULT 'locked',
            boot_status TEXT DEFAULT 'closed',
            horn_status TEXT DEFAULT 'off',
            engine_status TEXT DEFAULT 'off',
            lights_status TEXT DEFAULT 'off',
            gps_status TEXT DEFAULT 'active',
            infotainment_status TEXT DEFAULT 'online',
            firmware_version TEXT DEFAULT 'v1.0.0',
            network_status TEXT DEFAULT 'connected',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create api_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            method TEXT NOT NULL,
            endpoint TEXT NOT NULL,
            request_data TEXT,
            response_data TEXT,
            status_code INTEGER,
            source TEXT DEFAULT 'dashboard',
            user_id TEXT DEFAULT 'User A'
        )
    ''')
    
    # Create can_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS can_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            can_id TEXT NOT NULL,
            source_ecu TEXT,
            destination_ecu TEXT,
            payload TEXT NOT NULL,
            severity TEXT DEFAULT 'info'
        )
    ''')
    
    # Create event_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS event_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            event_type TEXT NOT NULL,
            description TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
    
    print("✓ Database initialized successfully")

def seed_data():
    """Seed the database with demo data"""
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if data already exists
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] > 0:
        conn.close()
        return
    
    # Create demo user
    cursor.execute('''
        INSERT INTO users (username, role)
        VALUES (?, ?)
    ''', ('User A', 'owner'))
    
    # Create demo vehicle - Tesla Model 3
    cursor.execute('''
        INSERT INTO vehicles (
            vin, owner, battery, doors_status, boot_status,
            horn_status, engine_status, lights_status, gps_status,
            infotainment_status, firmware_version, network_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        '5YJ3E1EA1KF000001',  # Tesla VIN format
        'User A',
        84,
        'locked',
        'closed',
        'off',
        'off',
        'off',
        'active',
        'online',
        'v1.2.3',
        'connected'
    ))
    
    conn.commit()
    conn.close()
    
    print("✓ Demo data seeded successfully")
    print("  - Demo Vehicle: Tesla Model 3 (VIN: 5YJ3E1EA1KF000001)")
    print("  - Owner: User A")
    print("  - Battery: 84%")
    print("  - Firmware: v1.2.3")
