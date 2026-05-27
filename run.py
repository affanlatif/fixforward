import subprocess
import sys
import os
import time
import signal
import socket

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def check_dependencies():
    """
    Checks if node and python requirements are present.
    """
    print("\033[33mChecking operational requirements for FixForward...\033[0m")
    
    # Check Python dependencies
    try:
        import fastapi
        import sqlalchemy
        import pydantic
        import jwt
        import passlib
        print("[OK] Python packages verified.")
    except ImportError as e:
        print(f"\033[31mMissing Python dependencies: {e.name}. Installing via pip...\033[0m")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])

    # Check node_modules in frontend
    if not os.path.exists("frontend/node_modules"):
        print("\033[31mMissing frontend node_modules. Running npm install...\033[0m")
        # Use cmd.exe on Windows to run npm
        subprocess.run("cmd.exe /c \"npm install\"", cwd="frontend", shell=True)
    else:
        print("[OK] Frontend node packages verified.")

def main():
    check_dependencies()

    backend_port = 8000
    frontend_port = 3000

    if is_port_in_use(backend_port):
        print(f"\033[31mError: Port {backend_port} is already in use. Is another instance of the backend running?\033[0m")
        sys.exit(1)
        
    if is_port_in_use(frontend_port):
        print(f"\033[31mError: Port {frontend_port} is already in use. Is another instance of the frontend running?\033[0m")
        sys.exit(1)

    print("\n\033[32m====================================================\033[0m")
    print("\033[32m       LAUNCHING FIXFORWARD CONTROL SUITE          \033[0m")
    print("\033[32m====================================================\033[0m\n")

    # Start FastAPI Backend
    # uvicorn main:app --port 8000
    print("\033[33mStarting AI Memory Backend (FastAPI on Port 8000)...\033[0m")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )

    # Start Next.js Frontend
    # npm run dev
    print("\033[33mStarting Operations UI Terminal (Next.js on Port 3000)...\033[0m")
    # On Windows, we run npm run dev inside shell with cmd.exe prefix
    frontend_proc = subprocess.Popen(
        "cmd.exe /c \"npm run dev\"",
        cwd="frontend",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True
    )

    # Function to print output from subprocesses
    def stream_output(proc, prefix):
        # Read a line from process stdout
        line = proc.stdout.readline()
        if line:
            print(f"[{prefix}] {line.strip()}")
        return proc.poll() is not None

    print("\033[32mTerminal Launch successful. Access the application at http://localhost:3000\033[0m")
    print("\033[33mPress Ctrl+C to terminate both servers and release ports.\033[0m\n")

    # Keep script alive, pipe standard outputs
    try:
        # We perform a small loop and monitor processes
        while True:
            # We can stream lines if they have any, but to avoid blocking, we do it simple:
            # Check backend
            if backend_proc.poll() is not None:
                print("\033[31m[BACKEND SHUT DOWN UNEXPECTEDLY]\033[0m")
                break
            if frontend_proc.poll() is not None:
                print("\033[31m[FRONTEND SHUT DOWN UNEXPECTEDLY]\033[0m")
                break
            time.sleep(0.5)
            
    except KeyboardInterrupt:
        print("\n\033[33mShutting down servers and clearing operational memory ports...\033[0m")
    finally:
        # Clean termination
        try:
            # On windows, taskkill is more reliable for subprocess trees (especially cmd.exe -> node)
            if os.name == 'nt':
                subprocess.run(f"taskkill /F /T /PID {backend_proc.pid}", stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                subprocess.run(f"taskkill /F /T /PID {frontend_proc.pid}", stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                backend_proc.terminate()
                frontend_proc.terminate()
        except Exception:
            pass
        print("\033[32m[OK] Ports released successfully. Operations terminated.\033[0m")

if __name__ == "__main__":
    main()
