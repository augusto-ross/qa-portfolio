from pydantic import BaseModel
from typing import Optional

class BookingDates(BaseModel):
    checkin: str
    checkout: str

class Booking(BaseModel):
    firstname: str
    lastname: str
    totalprice: int
    depositpaid: bool
    bookingdates: BookingDates
    additionalneeds: Optional[str] = None

class BookingResponse(BaseModel):
    bookingid: int
    booking: Booking

class BookingId(BaseModel):
    bookingid: int
