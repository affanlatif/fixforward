from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import List, Optional
import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "operator"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


# --- Comment Schemas ---
class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    pass

class CommentOut(CommentBase):
    id: int
    intervention_id: int
    user_id: int
    timestamp: datetime.datetime
    user: UserOut

    model_config = ConfigDict(from_attributes=True)


# --- Machine Schemas ---
class MachineBase(BaseModel):
    name: str
    serial_number: str
    status: str = "operational"
    location: str
    critical_level: str = "medium"
    image_url: Optional[str] = None

class MachineCreate(MachineBase):
    pass

class MachineOut(MachineBase):
    id: int
    last_updated: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


# --- Incident Schemas ---
class IncidentBase(BaseModel):
    title: str
    description: str
    severity: str = "major"
    status: str = "open"
    downtime_hours: float = 0.0
    root_cause_analysis: Optional[str] = None

class IncidentCreate(IncidentBase):
    machine_id: int
    related_intervention_id: Optional[int] = None

class IncidentOut(IncidentBase):
    id: int
    machine_id: int
    related_intervention_id: Optional[int] = None
    timestamp: datetime.datetime
    machine: MachineOut

    model_config = ConfigDict(from_attributes=True)


# --- Intervention (Operational Memory) Schemas ---
class InterventionBase(BaseModel):
    title: str
    description: str
    category: str
    action_taken: str
    status: str = "active"
    risk_level: str = "medium"
    confidence_score: float = 1.0
    ai_recommendation: Optional[str] = None
    transcript: Optional[str] = None

class InterventionCreate(BaseModel):
    machine_id: int
    title: str
    description: str
    category: str
    action_taken: str
    status: str = "active"
    risk_level: str = "medium"
    confidence_score: float = 1.0
    transcript: Optional[str] = None

class InterventionResolve(BaseModel):
    resolution_details: str

class InterventionOut(InterventionBase):
    id: int
    machine_id: int
    operator_id: int
    timestamp: datetime.datetime
    resolved_at: Optional[datetime.datetime] = None
    resolution_details: Optional[str] = None
    machine: MachineOut
    operator: UserOut
    comments: List[CommentOut] = []

    model_config = ConfigDict(from_attributes=True)


# --- ShiftHandover Schemas ---
class ShiftHandoverBase(BaseModel):
    shift_name: str
    summary: str
    critical_actions: Optional[str] = None
    handover_notes: Optional[str] = None

class ShiftHandoverCreate(ShiftHandoverBase):
    pass

class ShiftHandoverOut(ShiftHandoverBase):
    id: int
    supervisor_id: int
    timestamp: datetime.datetime
    supervisor: UserOut

    model_config = ConfigDict(from_attributes=True)


# --- AI Extraction & Search Schemas ---
class AIExtractionRequest(BaseModel):
    transcript: str

class AIExtractionResult(BaseModel):
    machine_name: str
    title: str
    description: str
    category: str
    action_taken: str
    risk_level: str
    confidence_score: float
    ai_recommendation: str

class SearchResultItem(BaseModel):
    type: str  # "intervention", "incident", "machine"
    id: int
    title: str
    subtitle: str
    description: str
    status: str
    timestamp: Optional[datetime.datetime] = None
    score: float
    url: str

class SearchResult(BaseModel):
    query: str
    results: List[SearchResultItem]
