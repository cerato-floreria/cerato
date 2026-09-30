import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret || secret.includes("placeholder")) {
      console.warn("Shopify Webhook received but WEBHOOK_SECRET is unset or placeholder.");
      return NextResponse.json({ message: "Webhook secret unconfigured" }, { status: 400 });
    }

    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");

    if (!hmacHeader) {
      return NextResponse.json({ message: "Missing HMAC header" }, { status: 401 });
    }

    const rawBody = await req.text();

    // Generate expected HMAC
    const hash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    const hashBuffer = Buffer.from(hash);
    const hmacBuffer = Buffer.from(hmacHeader);

    if (hashBuffer.length !== hmacBuffer.length || !crypto.timingSafeEqual(hashBuffer, hmacBuffer)) {
      console.error("Invalid Shopify Webhook HMAC signature.");
      return NextResponse.json({ message: "Invalid HMAC signature" }, { status: 401 });
    }

    console.log(`Received valid Shopify Webhook topic: ${topic}`);

    switch (topic) {
      case "products/create":
      case "products/update":
      case "products/delete":
        revalidateTag("products", "default");
        console.log("Revalidated tag: products");
        break;
      case "collections/update":
        revalidateTag("collections", "default");
        revalidateTag("products", "default");
        console.log("Revalidated tags: collections, products");
        break;
      case "inventory_levels/update":
        revalidateTag("products", "default");
        console.log("Revalidated tag: products for inventory update");
        break;
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
