import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { db } from '@/lib/db';
import { corrections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface CorrectionUpdateData {
    title?: string;
    description?: string;
    severity?: string;
    isResolved?: boolean;
    resolvedAt?: Date | null;
    updatedAt: Date;
  }

  
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const body = await request.json();
    const { title, description, severity, isResolved } = body;
    
    const updateData: CorrectionUpdateData = {
        updatedAt: new Date()
      };
          if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (severity !== undefined) updateData.severity = severity;
    if (isResolved !== undefined) {
      updateData.isResolved = isResolved;
      if (isResolved) {
        updateData.resolvedAt = new Date();
      } else {
        updateData.resolvedAt = null;
      }
    }
    updateData.updatedAt = new Date();
    
    const updatedCorrection = await db
      .update(corrections)
      .set(updateData)
      .where(eq(corrections.id, parseInt(id)))
      .returning();
    
    if (updatedCorrection.length === 0) {
      return NextResponse.json(
        { error: 'Correction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedCorrection[0]);
  } catch (error) {
    console.error('Error updating correction:', error);
    return NextResponse.json(
      { error: 'Failed to update correction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const { id } = await params;
    const deletedCorrection = await db
      .delete(corrections)
      .where(eq(corrections.id, parseInt(id)))
      .returning();
    
    if (deletedCorrection.length === 0) {
      return NextResponse.json(
        { error: 'Correction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Correction deleted successfully' });
  } catch (error) {
    console.error('Error deleting correction:', error);
    return NextResponse.json(
      { error: 'Failed to delete correction' },
      { status: 500 }
    );
  }
}
