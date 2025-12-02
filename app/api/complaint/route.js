export async function POST(req) {
  try {
    const body = await req.json();

    const { name, evidence } = body;

    console.log("Received complaint:", body);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Complaint received",
        data: {
          name,
          evidence,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing complaint:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to process complaint",
      }),
      { status: 500 }
    );
  }
}
