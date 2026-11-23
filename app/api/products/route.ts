import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// GET: Fetch all products & prices
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY createdAt DESC')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST: Add a new product or update a price
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const title = body.title
    const category = body.category
    const price = body.price
    const description = body.description ?? ''
    const imageUrl = body.imageUrl ?? body.image_url ?? ''

    if (!title || !category || price === undefined || price === null || price === '') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const query = `
      INSERT INTO products (title, category, price, imageUrl, description, createdAt) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `
    const [result] = await pool.query(query, [title, category, price, imageUrl, description])

    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 })
  }
}
