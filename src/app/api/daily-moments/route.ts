import { NextRequest, NextResponse } from "next/server";

// Temporary in-memory storage for development
let mockData: any[] = [
  {
    id: "1",
    name: "ยาย",
    date: new Date(Date.now() - 86400000).toDateString(),
    moments: ["หลานโทรมาคุย", "อาหารอร่อย", "นอนหลับสบาย"],
    mood: "peaceful",
    recorded: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "2",
    name: "ปู่", 
    date: new Date(Date.now() - 172800000).toDateString(),
    moments: ["เพื่อนมาเยี่ยม", "สุขภาพดี", "อากาศดี"],
    mood: "happy",
    recorded: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (date) {
      // Get all moments for specific date
      const moments = mockData.filter(item => item.date === date);
      if (moments.length > 0) {
        return NextResponse.json(moments);
      } else {
        return NextResponse.json({ error: "No moments found for this date" }, { status: 404 });
      }
    } else {
      // Get all moments
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error("Error fetching daily moments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    mockData.push(newMoment);

    return NextResponse.json(newMoment, { status: 201 });
  } catch (error) {
    console.error("Error creating daily moment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, date, moments, mood } = body;

    if (!id) {
      return NextResponse.json({ 
        error: "ID is required" 
      }, { status: 400 });
    }

    const existingIndex = mockData.findIndex(item => item.id === id);
    if (existingIndex === -1) {
      return NextResponse.json({ 
        error: "No moments found for this ID" 
      }, { status: 404 });
    }

    // Update the existing moment
    const existingMoment = mockData[existingIndex];
    const updateData = {
      ...existingMoment,
      name: name || existingMoment.name,
      moments: moments ? moments.filter((m: string) => m && m.trim()) : existingMoment.moments,
      mood: mood || existingMoment.mood,
      updatedAt: new Date().toISOString()
    };

    mockData[existingIndex] = updateData;

    return NextResponse.json(updateData);
  } catch (error) {
    console.error("Error updating daily moment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ 
        error: "ID parameter is required" 
      }, { status: 400 });
    }

    const existingIndex = mockData.findIndex(item => item.id === id);
    if (existingIndex === -1) {
      return NextResponse.json({ 
        error: "No moments found for this ID" 
      }, { status: 404 });
    }

    mockData.splice(existingIndex, 1);

    return NextResponse.json({ message: "Daily moments deleted successfully" });
  } catch (error) {
    console.error("Error deleting daily moment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}