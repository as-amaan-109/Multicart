import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product.model";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Delete review body:", body);

    const { productId, reviewId } = body;

    if (!productId || !reviewId) {
      return NextResponse.json(
        { message: "productId or reviewId missing" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const initialLength = product.reviews.length;

    product.reviews = product.reviews.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => r._id.toString() !== reviewId.toString()
    );

    if (product.reviews.length === initialLength) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    await product.save();

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
