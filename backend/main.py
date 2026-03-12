"""
FastAPI Backend for Academic Performance Prediction System
"""
import json
import os
import sys

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.predictor import predict_student
from utils.data_generator import save_students_json

app = FastAPI(
    title="Academic Performance Prediction API",
    description="Sistem Prediksi Performa Akademik Mahasiswa",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

STUDENTS_JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "students.json")

_students_cache: dict[str, dict] = {}


def load_students() -> dict[str, dict]:
    """Load students from JSON, generate if missing."""
    global _students_cache
    if _students_cache:
        return _students_cache

    if not os.path.exists(STUDENTS_JSON_PATH):
        print("students.json not found – generating...")
        save_students_json(STUDENTS_JSON_PATH)

    with open(STUDENTS_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    _students_cache = {s["nim"]: s for s in data}
    print(f"Loaded {len(_students_cache)} students.")
    return _students_cache


@app.on_event("startup")
async def startup_event():
    load_students()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    students = load_students()
    return {"status": "ok", "total_students": len(students)}


@app.get("/api/students")
def list_students(
    page: int = 1,
    limit: int = 20,
    prodi: Optional[str] = None,
    search: Optional[str] = None,
):
    """List all students with pagination, optional prodi filter, and name/NIM search."""
    students = load_students()
    items = list(students.values())

    if prodi:
        items = [s for s in items if s["prodi_key"].upper() == prodi.upper() or
                 s["prodi"].lower() == prodi.lower()]

    if search:
        s_lower = search.lower()
        items = [s for s in items if s_lower in s["nim"] or s_lower in s["nama"].lower()]

    total = len(items)
    start = (page - 1) * limit
    end = start + limit
    page_items = items[start:end]

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "students": [
            {
                "nim": s["nim"],
                "nama": s["nama"],
                "prodi": s["prodi"],
                "prodi_key": s["prodi_key"],
                "angkatan": s["angkatan"],
                "jenis_kelamin": s["jenis_kelamin"],
                "semester_aktif": s["semester_aktif"],
                "ipk_kumulatif": s["ipk_kumulatif"],
            }
            for s in page_items
        ],
    }


@app.get("/api/student/{nim}")
def get_student(nim: str):
    """Get student info by NIM."""
    students = load_students()
    student = students.get(nim)
    if not student:
        raise HTTPException(status_code=404, detail=f"Mahasiswa dengan NIM {nim} tidak ditemukan.")
    return student


@app.get("/api/predict/{nim}")
def predict(nim: str):
    """Get full prediction for a student."""
    students = load_students()
    student = students.get(nim)
    if not student:
        raise HTTPException(status_code=404, detail=f"Mahasiswa dengan NIM {nim} tidak ditemukan.")

    prediksi = predict_student(student)

    return {
        "nim": student["nim"],
        "nama": student["nama"],
        "prodi": student["prodi"],
        "prodi_key": student["prodi_key"],
        "angkatan": student["angkatan"],
        "jenis_kelamin": student["jenis_kelamin"],
        "semester_aktif": student["semester_aktif"],
        "ipk_kumulatif": student["ipk_kumulatif"],
        "riwayat_semester": student["riwayat_semester"],
        "prediksi": prediksi,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
