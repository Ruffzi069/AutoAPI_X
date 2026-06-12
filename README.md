# AutoAPI-X

### Connected Vehicle API Security Simulation Platform

AutoAPI-X is an educational and research-oriented automotive cybersecurity platform designed to demonstrate how modern connected vehicles interact with cloud APIs, telematics infrastructure, infotainment systems, and CAN networks.

The platform allows researchers, students, and security professionals to visualize how API requests can translate into vehicle actions and CAN bus messages within a controlled simulation environment.

---

## Educational Purpose

AutoAPI-X was created to help security researchers understand the security implications of connected vehicle ecosystems.

### What AutoAPI-X Is

* Connected vehicle API simulation platform
* Automotive cybersecurity learning environment
* CAN bus traffic generation and monitoring framework
* Research platform for vehicle-cloud interaction studies
* Digital twin demonstration environment

### What AutoAPI-X Is Not

* Real vehicle control software
* Vehicle hacking toolkit
* Driving simulator
* Racing simulator
* Production automotive software

---

## Architecture

Every vehicle action follows the same workflow:

```text
User Action
      ↓
API Request
      ↓
Backend Service
      ↓
CAN Frame Generation
      ↓
Vehicle State Update
      ↓
Event Logging
      ↓
Real-Time Broadcast
```

---

## Technology Stack

### Backend

* Python 3.8+
* Flask
* Flask-SocketIO
* SQLite
* python-can
* SocketCAN

### Future Frontend

* React
* Vite
* TailwindCSS
* Socket.IO Client
* Framer Motion

---

## Project Structure

```text
backend/
├── app.py
├── config/
│   └── config.py
├── database/
│   ├── database.py
│   └── autoapi.db
├── models/
│   ├── vehicle.py
│   └── user.py
├── services/
│   ├── vehicle_service.py
│   ├── can_service.py
│   └── logging_service.py
├── routes/
│   ├── vehicle_routes.py
│   └── system_routes.py
├── can/
│   └── socketcan_manager.py
└── logs/
    ├── api_logs/
    ├── can_logs/
    └── event_logs/
```

---

## Features

### Vehicle Operations

* Lock vehicle
* Unlock vehicle
* Open boot/trunk
* Start engine
* Vehicle status retrieval

### CAN Simulation

* Virtual CAN interface support
* Real-time CAN frame generation
* SocketCAN integration
* CAN traffic monitoring using `candump`

### Monitoring & Logging

* API request logging
* CAN transmission logging
* System event logging
* Real-time SocketIO events

### Digital Twin

* Vehicle state management
* Persistent storage with SQLite
* Vehicle ownership simulation
* Connected vehicle status monitoring

---

## Installation

### Prerequisites

* Python 3.8+
* Linux system
* SocketCAN support
* can-utils package

### Install Dependencies

Ubuntu / Debian:

```bash
sudo apt update
sudo apt install python3 python3-pip can-utils
```

Fedora / RHEL:

```bash
sudo dnf install python3 python3-pip can-utils
```

---

## Configure Virtual CAN

Load the virtual CAN kernel module:

```bash
sudo modprobe vcan
```

Create the interface:

```bash
sudo ip link add dev vcan0 type vcan
```

Bring the interface online:

```bash
sudo ip link set up vcan0
```

Verify:

```bash
ip link show vcan0
```

---

## Install Python Requirements

```bash
cd backend
pip install -r requirements.txt
```

---

## Run AutoAPI-X

```bash
python app.py
```

Default URL:

```text
http://localhost:5000
```

---

## Monitoring CAN Traffic

Open a second terminal:

```bash
candump vcan0
```

Example output:

```text
vcan0 321 [8] 01 00 00 00 00 00 00 00
vcan0 321 [8] 02 00 00 00 00 00 00 00
vcan0 323 [8] 03 00 00 00 00 00 00 00
vcan0 324 [8] 05 00 00 00 00 00 00 00
```

---

## API Endpoints

### System

```http
GET /api/system/status
```

### Vehicles

```http
GET /api/vehicles
GET /api/vehicles/{vin}
POST /api/vehicles/{vin}/lock
POST /api/vehicles/{vin}/unlock
POST /api/vehicles/{vin}/boot/open
POST /api/vehicles/{vin}/engine/start
```

---

## Example Requests

### System Status

```bash
curl http://localhost:5000/api/system/status
```

### List Vehicles

```bash
curl http://localhost:5000/api/vehicles
```

### Unlock Vehicle

```bash
curl -X POST \
http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
```

### Start Engine

```bash
curl -X POST \
http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

---

## Demo Vehicle

| Property     | Value             |
| ------------ | ----------------- |
| Model        | Tesla Model 3     |
| VIN          | 5YJ3E1EA1KF000001 |
| Owner        | User A            |
| Battery      | 84%               |
| Firmware     | v1.2.3            |
| Connectivity | Connected         |

---

## ECU Mapping

| ECU              | CAN ID | Purpose             |
| ---------------- | ------ | ------------------- |
| Door ECU         | 0x321  | Lock / Unlock       |
| Horn ECU         | 0x322  | Horn Control        |
| Boot ECU         | 0x323  | Boot Control        |
| Ignition ECU     | 0x324  | Engine Start / Stop |
| Lights ECU       | 0x325  | Lighting Control    |
| GPS ECU          | 0x327  | Vehicle Tracking    |
| Infotainment ECU | 0x400  | Media & Display     |

---

## Real-Time Events

SocketIO broadcasts:

| Event           | Description           |
| --------------- | --------------------- |
| vehicle_updates | Vehicle state changes |
| can_updates     | CAN transmissions     |
| api_updates     | API activity          |
| event_updates   | System events         |

---

## Database

### Tables

* users
* vehicles
* api_logs
* can_logs
* event_logs

---

## Development Roadmap

### Phase 1 — Backend Foundation

* Flask backend
* SQLite database
* CAN generation engine
* SocketIO integration
* Vehicle APIs

### Phase 2 — Digital Twin Environment

* Vehicle state visualization
* Mobile controller simulation

### Phase 3 — Monitoring Dashboard

* Real-time telemetry
* CAN monitoring dashboard

### Phase 4 — Attack Simulation Center

* API abuse demonstrations
* Authentication flaws
* Telematics attack scenarios

### Phase 5 — Impact Analysis Engine

* Risk visualization
* Attack path mapping

### Phase 6 — Secure vs Vulnerable Modes

* Security comparison demonstrations
* Defensive architecture examples

---

## Troubleshooting

### vcan0 Not Found

```bash
sudo modprobe -r vcan
sudo modprobe vcan

sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Permission Issues

```bash
sudo usermod -a -G dialout $USER
```

Logout and log back in after running the command.

### Port Already In Use

Change the port inside `app.py`:

```python
socketio.run(
    app,
    host="0.0.0.0",
    port=5001,
    debug=True
)
```

---

## Contributing

Contributions are welcome for:

* Automotive cybersecurity education
* Research-focused features
* Documentation improvements
* Security demonstrations
* Bug fixes and optimizations

---

## Disclaimer

AutoAPI-X is intended solely for educational, research, and demonstration purposes.

The platform does not interface with real vehicles and should not be used to test against systems without explicit authorization.

---

## License
Educational & Research Use License

### By Daksh Bhagwani
