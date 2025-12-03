export async function POST(req) {
  try {
    const data = await req.json();

    console.log("📥 New Complaint Received:");
    console.log(JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        message: "Complaint received successfully",
        complaintNumber: data.complaintNumber,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in complaint submission:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error processing complaint",
      }),
      { status: 500 }
    );
  }
}
