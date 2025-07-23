import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { db, dailyMoments } = await import("@/lib/db");
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (date) {
      // Get all moments for specific date
      const moments = await db.select().from(dailyMoments).where(eq(dailyMoments.date, date));
      if (moments.length > 0) {
        return NextResponse.json(moments);
      } else {
        return NextResponse.json({ error: "No moments found for this date" }, { status: 404 });
      }
    } else {
      // Get all moments
      const moments = await db.select().from(dailyMoments);
      return NextResponse.json(moments);
    }
  } catch (error) {
    console.error("Error fetching daily moments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db, dailyMoments } = await import("@/lib/db");
    const body = await request.json();
    const { name, date, moments, mood } = body;

    if (!name || !date || !moments || !Array.isArray(moments)) {
      return NextResponse.json({ 
        error: "Missing required fields: name, date and moments array" 
      }, { status: 400 });
    }

    const filteredMoments = moments.filter(m => m && m.trim());
    if (filteredMoments.length === 0) {
      return NextResponse.json({ 
        error: "At least one moment is required" 
      }, { status: 400 });
    }

    const id = Date.now().toString();
    const now = new Date();
    const newMoment = {
      id,
      name,
      date,
      moments: filteredMoments,
      mood: mood || "happy",
      recorded: true,
      createdAt: now,
      updatedAt: now
    };

    await db.insert(dailyMoments).values(newMoment);

    return NextResponse.json(newMoment, { status: 201 });
  } catch (error) {
    console.error("Error creating daily moment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db, dailyMoments } = await import("@/lib/db");
    const body = await request.json();
    const { id, name, date, moments, mood } = body;

    if (!id) {
      return NextResponse.json({ 
        error: "ID is required" 
      }, { status: 400 });
    }

    const existingMoments = await db.select().from(dailyMoments).where(eq(dailyMoments.id, id));
    const existingMoment = existingMoments[0];
    if (!existingMoment) {
      return NextResponse.json({ 
        error: "No moments found for this ID" 
      }, { status: 404 });
    }

    // Update the existing moment
    const updateData = {
      name: name || existingMoment.name,
      moments: moments ? moments.filter((m: string) => m && m.trim()) : existingMoment.moments,
      mood: mood || existingMoment.mood,
      updatedAt: new Date()
    };

    await db.update(dailyMoments).set(updateData).where(eq(dailyMoments.id, id));

    const updatedMoment = { ...existingMoment, ...updateData };
    return NextResponse.json(updatedMoment);
  } catch (error) {
    console.error("Error updating daily moment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { db, dailyMoments } = await import("@/lib/db");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ 
        error: "ID parameter is required" 
      }, { status: 400 });
    }

    const existingMoments = await db.select().from(dailyMoments).where(eq(dailyMoments.id, id));
    const existingMoment = existingMoments[0];
    if (!existingMoment) {
      return NextResponse.json({ 
        error: "No moments found for this ID" 
      }, { status: 404 });
    }

    await db.delete(dailyMoments).where(eq(dailyMoments.id, id));

    return NextResponse.json({ message: "Daily moments deleted successfully" });
  } catch (error) {
    console.error("Error deleting daily moment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}