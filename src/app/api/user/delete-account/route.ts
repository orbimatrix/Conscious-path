import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/client';

// For Next.js App Router, we need to use the server-side approach
async function deleteUserFromClerk(userId: string) {
    try {
        // Use fetch to call Clerk's API directly
        const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Clerk API error: ${response.status} ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error calling Clerk API:', error);
        throw error;
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Get the authenticated user
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Verify the user is trying to delete their own account
        const body = await request.json();
        if (body.userId !== userId) {
            return NextResponse.json(
                { error: 'No puedes eliminar la cuenta de otro usuario' },
                { status: 403 }
            );
        }

        const supabase = createClient();

        // First, delete all user data from database
        
        // Delete user messages
        const { error: messagesError } = await supabase
            .from('messages')
            .delete()
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
        
        if (messagesError) {
            console.error('Error deleting messages:', messagesError);
        }

        // Delete user news
        const { error: newsError } = await supabase
            .from('news')
            .delete()
            .or(`author_id.eq.${userId},target_user_id.eq.${userId}`);
        
        if (newsError) {
            console.error('Error deleting news:', newsError);
        }

        // Delete user payment history
        const { error: paymentError } = await supabase
            .from('payment_history')
            .delete()
            .eq('clerk_id', userId);
        
        if (paymentError) {
            console.error('Error deleting payment history:', paymentError);
        }

        // Delete user levels - first get the user ID, then delete levels
        const { data: userData, error: userQueryError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();
        
        if (userQueryError) {
            console.error('Error querying user ID:', userQueryError);
        } else if (userData) {
            const { error: userLevelsError } = await supabase
                .from('user_levels')
                .delete()
                .eq('user_id', userData.id);
            
            if (userLevelsError) {
                console.error('Error deleting user levels:', userLevelsError);
            }

            // Delete user corrections
            const { error: correctionsError } = await supabase
                .from('corrections')
                .delete()
                .eq('user_id', userData.id);
            
            if (correctionsError) {
                console.error('Error deleting corrections:', correctionsError);
            }
        }

        // Delete user subscriptions
        const { error: subscriptionsError } = await supabase
            .from('user_subscriptions')
            .delete()
            .eq('clerk_id', userId);
        
        if (subscriptionsError) {
            console.error('Error deleting subscriptions:', subscriptionsError);
        }

        // Delete user from users table
        const { error: userError } = await supabase
            .from('users')
            .delete()
            .eq('clerk_id', userId);
        
        if (userError) {
            console.error('Error deleting user:', userError);
            throw new Error('Error al eliminar datos del usuario de la base de datos');
        }

        // Now delete the user from Clerk using the direct API call
        try {
            await deleteUserFromClerk(userId);
        } catch (clerkError) {
            console.error('Error deleting user from Clerk:', clerkError);
            throw new Error('Error al eliminar usuario de Clerk');
        }

        return NextResponse.json(
            { message: 'Cuenta eliminada exitosamente' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in delete-account API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
