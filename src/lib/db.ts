import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";
import { handleDatabaseError } from "./utils/db-errors";

type CreditTransactionType = "purchase" | "usage" | "bonus" | "refund";

interface CreditTransaction {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  description: string;
  metadata?: Record<string, any>;
}

export async function getUserCredits(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (error) throw handleDatabaseError(error);
  return data?.credits ?? 0;
}

export async function createCreditTransaction(transaction: CreditTransaction): Promise<void> {
  const { error } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      metadata: transaction.metadata || {},
    });

  if (error) throw handleDatabaseError(error);
}

export async function updateUserCredits(userId: string, amount: number): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ credits: amount })
    .eq("id", userId);

  if (error) throw handleDatabaseError(error);
}

export async function getCreditTransactions(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<Array<Database["public"]["Tables"]["credit_transactions"]["Row"]>> {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw handleDatabaseError(error);
  return data;
}

export async function getCreditTransactionsSummary(userId: string): Promise<{
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
}> {
  const { data: transactions, error } = await supabase
    .from("credit_transactions")
    .select("amount,type")
    .eq("user_id", userId);

  if (error) throw handleDatabaseError(error);

  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "usage") {
        acc.usedCredits += Math.abs(transaction.amount);
      } else {
        acc.totalCredits += transaction.amount;
      }
      return acc;
    },
    { totalCredits: 0, usedCredits: 0 }
  );

  return {
    totalCredits: summary.totalCredits,
    usedCredits: summary.usedCredits,
    availableCredits: summary.totalCredits - summary.usedCredits,
  };
}

export async function addCreditsToUser(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description: string,
  metadata?: Record<string, any>
): Promise<void> {
  // Start a Supabase transaction
  const { error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
    p_metadata: metadata || {},
  });

  if (error) throw handleDatabaseError(error);
}

export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  const currentCredits = await getUserCredits(userId);
  return currentCredits >= requiredCredits;
}

export async function validateAndDeductCredits(
  userId: string,
  requiredCredits: number,
  description: string
): Promise<void> {
  const hasCredits = await hasEnoughCredits(userId, requiredCredits);
  if (!hasCredits) {
    throw new Error(`Insufficient credits. Required: ${requiredCredits}`);
  }

  await addCreditsToUser(userId, -requiredCredits, "usage", description);
}

// Export types
export type { CreditTransaction, CreditTransactionType };