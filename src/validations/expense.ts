import Joi from "joi";
import type {
  CreateExpenseRequest,
  ListExpensesQuery,
} from "../services/expense";

export type ExpenseFormValues = {
  amount: string;
  categoryId: string;
  date: string;
  note: string;
};

export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

export const getTodayDate = () => new Date().toISOString().slice(0, 10);

const amountSchema = Joi.string()
  .trim()
  .required()
  .pattern(/^\d+(\.\d{1,2})?$/)
  .custom((value, helpers) => {
    const amount = Number(value);

    if (amount <= 0) {
      return helpers.error("amount.positive");
    }

    if (amount > 9999999999.99) {
      return helpers.error("amount.max");
    }

    return value;
  })
  .messages({
    "any.required": "Amount is required",
    "string.empty": "Amount is required",
    "string.pattern.base": "Use a valid amount with up to 2 decimals",
    "amount.positive": "Amount must be greater than 0",
    "amount.max": "Amount is too high",
  });

const dateSchema = Joi.string()
  .trim()
  .required()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .custom((value, helpers) => {
    if (value > getTodayDate()) {
      return helpers.error("date.future");
    }

    return value;
  })
  .messages({
    "any.required": "Date is required",
    "string.empty": "Date is required",
    "string.pattern.base": "Use YYYY-MM-DD date format",
    "date.future": "Future dates are not allowed",
  });

const expenseSchema = Joi.object<ExpenseFormValues>({
  amount: amountSchema,
  categoryId: Joi.string().trim().required().messages({
    "any.required": "Choose a category",
    "string.empty": "Choose a category",
  }),
  date: dateSchema,
  note: Joi.string().allow("").trim().max(500).messages({
    "string.max": "Note must be 500 characters or less",
  }),
}).options({ abortEarly: false });

export const validateExpenseForm = (values: ExpenseFormValues) => {
  const { error, value } = expenseSchema.validate(values);
  const errors: ExpenseFormErrors = {};

  if (error) {
    error.details.forEach((detail) => {
      const field = detail.path[0] as keyof ExpenseFormValues;
      errors[field] = detail.message;
    });
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    value: value as ExpenseFormValues,
  };
};

export const toCreateExpenseRequest = (
  values: ExpenseFormValues,
): CreateExpenseRequest => ({
  amount: values.amount.trim(),
  categoryId: values.categoryId,
  date: values.date,
  note: values.note.trim() === "" ? null : values.note.trim(),
});

export const validateExpenseFilters = (filters: ListExpensesQuery) => {
  if (
    typeof filters.from === "string" &&
    filters.from.trim() !== "" &&
    filters.from > getTodayDate()
  ) {
    return "From date cannot be in the future";
  }

  if (
    typeof filters.to === "string" &&
    filters.to.trim() !== "" &&
    filters.to > getTodayDate()
  ) {
    return "To date cannot be in the future";
  }

  if (
    typeof filters.from === "string" &&
    typeof filters.to === "string" &&
    filters.from.trim() !== "" &&
    filters.to.trim() !== "" &&
    filters.from > filters.to
  ) {
    return "From date must be earlier than or equal to To date";
  }

  return "";
};
