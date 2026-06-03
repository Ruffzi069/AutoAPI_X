"""
AutoAPI-X - Production Server Runner (No Debug Mode)
Use this for production or to avoid port conflicts
"""

from app import app, socketio

if __name__ == '__main__':
    print("=" * 60)
    print("AutoAPI-X - Connected Vehicle API Security Platform")
    print("=" * 60)
    print("Production server starting...")
    print("API endpoints available at http://localhost:5000/api")
    print("SocketIO enabled for real-time updates")
    print("=" * 60)
    print("\nPress CTRL+C to stop the server\n")
    
    # Run without debug mode (no reloader, no port conflicts)
    socketio.run(
        app, 
        debug=False, 
        host='0.0.0.0', 
        port=5000,
        allow_unsafe_werkzeug=True
    )
