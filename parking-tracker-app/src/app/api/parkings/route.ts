import { NextResponse, type NextRequest } from "next/server";

import { and, eq, asc } from "drizzle-orm";
// import Pusher from "pusher";

import { db } from "@/db";
import { parkingsTable } from "@/db/schema";
// import { auth } from "@/lib/auth";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import { updateParkingSchema } from "@/validators/updateParkings";
// import { updateDocSchema } from "@/validators/updateDocument";
// import { send } from "process";

interface Position {
  lat?: number;
  lng?: number;
}

interface ParkingInfo {
  position?: Position;
  currMotor?: number | null;
  maxSpace?: number | null;
}

interface ParkingInfos {
  [id: string]: ParkingInfo;
}
interface ParkingSchema {

  latitude?: string | null;
  longitude?: string | null;
  maxSpace?: number | null;
  polygons?: string | null;
}

// interface UpdateParkingData {
//   id: string;
//   currMotor: number;
// }
export async function GET(
  req: NextRequest,

) {
  try {
    const dbParkings = await db
      .select({
        parkingId: parkingsTable.displayId,
        latitude: parkingsTable.latitude,
        longitude: parkingsTable.longitude,
        currMotor: parkingsTable.currMotor,
        maxSpace: parkingsTable.maxSpace,

      })
      .from(parkingsTable)
      // .where(eq(parkingsTable.documentId, params.documentId))
      // .orderBy(asc(parkingsTable.createdAt))
      // .execute()

      let parkingInfos:ParkingInfos = {}
      for (const parking of dbParkings){
        const parkingId = parking.parkingId
        const position:Position = {
          lat: Number(parking.latitude),
          lng: Number(parking.longitude)
        }
        parkingInfos[parkingId] = {
          position: position,
          currMotor: parking.currMotor,
          maxSpace: parking.maxSpace,
        }
      }

    
    return NextResponse.json(
      {
        parkingInfos
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

// PUT /api/documents/:documentId

export async function PUT(
  req: NextRequest,
) {
  try{

    // Parse the request body
    const { _, data } = await req.json();
    const reqBody = data;
    const {id, latitude, longitude, maxSpace, polygon} = data
    let validatedReqBody: ParkingSchema;
    try {
      console.log(reqBody)
      validatedReqBody = updateParkingSchema.parse(reqBody);
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    // Check existance of the record
    const [parking] = await db
      .select({
        parkingId: parkingsTable.displayId,
      })
      .from(parkingsTable)
      .where(eq(parkingsTable.displayId, id))
    const action = !parking? "create": "update"
    // Create Parking Record
    if (action==="create"){
        console.log("Create record")
        const [createdParking] = await db
        .insert(parkingsTable)
        .values({
          displayId: id,
          latitude:latitude,
          longitude: longitude,
          maxSpace: maxSpace,
          polygon: polygon,
        })
        .returning()
        .execute();
    }
    if (action==='update'){
      console.log(reqBody)
      const [updatedParking] = await db
        .update(parkingsTable)
        .set({
          latitude:latitude,
          longitude: longitude,
          maxSpace: maxSpace,
          polygon: polygon, 
        })
        .where(eq(parkingsTable.displayId, id))
        .returning();
      if (updatedParking){
        console.log("Update Successful")
      }
    }


    return NextResponse.json(
      // {
      //   id: updatedDoc.displayId,
      //   title: updatedDoc.title,
      //   content: updatedDoc.content,
      // },
      { status: 200 },
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }}
