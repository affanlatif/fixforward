import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="operator")  # administrator, manager, supervisor, operator, technician
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    interventions = relationship("Intervention", back_populates="operator")
    comments = relationship("Comment", back_populates="user")
    handovers = relationship("ShiftHandover", back_populates="supervisor")


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    serial_number = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="operational")  # operational, warning, down, maintenance
    location = Column(String, nullable=False)
    critical_level = Column(String, default="medium")  # high, medium, low
    image_url = Column(String, nullable=True)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    interventions = relationship("Intervention", back_populates="machine", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="machine", cascade="all, delete-orphan")


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # RPM Reduction, Sensor Override, Valve Bypass, Temporary Patch, Air Cooling, Other
    action_taken = Column(Text, nullable=False)
    
    status = Column(String, default="active")  # active, resolved, escalated
    risk_level = Column(String, default="medium")  # high, medium, low
    confidence_score = Column(Float, default=1.0)
    
    ai_recommendation = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    resolution_details = Column(Text, nullable=True)

    # Relationships
    machine = relationship("Machine", back_populates="interventions")
    operator = relationship("User", back_populates="interventions")
    comments = relationship("Comment", back_populates="intervention", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="related_intervention")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    related_intervention_id = Column(Integer, ForeignKey("interventions.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="major")  # critical, major, minor
    status = Column(String, default="open")  # open, closed
    downtime_hours = Column(Float, default=0.0)
    root_cause_analysis = Column(Text, nullable=True)

    # Relationships
    machine = relationship("Machine", back_populates="incidents")
    related_intervention = relationship("Intervention", back_populates="incidents")


class ShiftHandover(Base):
    __tablename__ = "shift_handovers"

    id = Column(Integer, primary_key=True, index=True)
    shift_name = Column(String, nullable=False)  # Shift A (Morning), Shift B (Afternoon), Shift C (Night)
    supervisor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    summary = Column(Text, nullable=False)
    critical_actions = Column(Text, nullable=True)
    handover_notes = Column(Text, nullable=True)

    # Relationships
    supervisor = relationship("User", back_populates="handovers")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    intervention_id = Column(Integer, ForeignKey("interventions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    text = Column(Text, nullable=False)
    
    # Relationships
    intervention = relationship("Intervention", back_populates="comments")
    user = relationship("User", back_populates="comments")
