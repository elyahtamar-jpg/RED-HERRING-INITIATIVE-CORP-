export async function POST(request) {
  try {
    const data = await request.json();

    console.log("Received complaint:", data);

    return Response.json(
      { message: "Complaint received successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);

    return Response.json(
      { error: "Failed to process complaint" },
      { status: 500 }
    );
  }
}
