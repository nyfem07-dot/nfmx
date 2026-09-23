"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Field,
  PrimaryButton,
  ResultPanel,
  SecondaryButton,
  TextInput,
  Workspace,
} from "../shared";

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  price: number;
};

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "NGN", label: "NGN (₦)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
];

const currencySymbols: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  EUR: "€",
  CAD: "$",
  AUD: "$",
};

function formatMoney(value: number, currency: string) {
  return `${currencySymbols[currency] || currency} ${value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function InvoiceGeneratorTools() {
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState("");

  const [currency, setCurrency] = useState("USD");
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");

  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(
    "Payment is due by the due date.",
  );

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: Date.now(),
      description: "Service",
      quantity: 1,
      price: 0,
    },
  ]);

  const [generating, setGenerating] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Math.max(0, item.quantity) * Math.max(0, item.price),
        0,
      ),
    [items],
  );

  const taxRate = Math.max(0, Number(tax) || 0);
  const discountRate = Math.max(0, Number(discount) || 0);

  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = subtotal * (discountRate / 100);
  const total = Math.max(0, subtotal + taxAmount - discountAmount);

  function updateItem(
    id: number,
    field: keyof InvoiceItem,
    value: string,
  ) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        if (field === "description") {
          return { ...item, description: value };
        }

        const numericValue = Math.max(0, Number(value) || 0);

        return {
          ...item,
          [field]: numericValue,
        };
      }),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: Date.now() + current.length,
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(id: number) {
    setItems((current) => {
      if (current.length === 1) return current;
      return current.filter((item) => item.id !== id);
    });
  }

  function reset() {
    setBusinessName("");
    setBusinessEmail("");
    setBusinessPhone("");
    setBusinessAddress("");

    setCustomerName("");
    setCustomerEmail("");
    setCustomerAddress("");

    setInvoiceNumber("INV-001");
    setInvoiceDate(today());
    setDueDate("");

    setCurrency("USD");
    setTax("0");
    setDiscount("0");

    setNotes("");
    setPaymentTerms("Payment is due by the due date.");

    setItems([
      {
        id: Date.now(),
        description: "Service",
        quantity: 1,
        price: 0,
      },
    ]);
  }

  async function downloadPdf() {
    if (generating) return;

    setGenerating(true);

    try {
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([595.28, 841.89]);

      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

      const width = page.getWidth();
      const height = page.getHeight();

      const margin = 42;
      const right = width - margin;

      let y = height - margin;

      const drawText = (
        text: string,
        x: number,
        yPosition: number,
        size = 10,
        font = regular,
      ) => {
        page.drawText(text, {
          x,
          y: yPosition,
          size,
          font,
          color: rgb(0.12, 0.14, 0.2),
        });
      };

      const drawRightText = (
        text: string,
        yPosition: number,
        size = 10,
        font = regular,
      ) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        drawText(text, right - textWidth, yPosition, size, font);
      };

      page.drawRectangle({
        x: 0,
        y: height - 115,
        width,
        height: 115,
        color: rgb(0.055, 0.063, 0.09),
      });

      drawText(
        businessName.trim() || "Your Business",
        margin,
        height - 55,
        22,
        bold,
      );

      drawText(
        businessEmail.trim() || "Business email",
        margin,
        height - 75,
        9,
      );

      drawText(
        businessPhone.trim() || "Business phone",
        margin,
        height - 91,
        9,
      );

      drawRightText("INVOICE", height - 52, 24, bold);
      drawRightText(invoiceNumber || "INV-001", height - 77, 10, regular);

      y = height - 150;

      drawText("BILL TO", margin, y, 9, bold);

      drawText(
        customerName.trim() || "Customer",
        margin,
        y - 20,
        11,
        bold,
      );

      let customerLineY = y - 36;

      if (customerEmail.trim()) {
        drawText(customerEmail.trim(), margin, customerLineY, 9);
        customerLineY -= 14;
      }

      if (customerAddress.trim()) {
        drawText(customerAddress.trim(), margin, customerLineY, 9);
      }

      drawRightText(`Invoice date: ${invoiceDate || "—"}`, y - 2, 9);
      drawRightText(`Due date: ${dueDate || "—"}`, y - 18, 9);

      y -= 85;

      page.drawRectangle({
        x: margin,
        y: y - 22,
        width: width - margin * 2,
        height: 24,
        color: rgb(0.93, 0.94, 0.97),
      });

      drawText("DESCRIPTION", margin + 8, y - 15, 8, bold);
      drawText("QTY", 355, y - 15, 8, bold);
      drawText("PRICE", 410, y - 15, 8, bold);
      drawRightText("AMOUNT", y - 15, 8, bold);

      y -= 44;

      for (const item of items) {
        const description = item.description.trim() || "Item";
        const amount = Math.max(0, item.quantity) * Math.max(0, item.price);

        drawText(description.slice(0, 52), margin + 8, y, 9);
        drawText(String(item.quantity), 355, y, 9);
        drawText(formatMoney(item.price, currency), 410, y, 9);
        drawRightText(formatMoney(amount, currency), y, 9);

        y -= 25;

        page.drawLine({
          start: { x: margin, y },
          end: { x: right, y },
          thickness: 0.5,
          color: rgb(0.86, 0.87, 0.9),
        });

        y -= 12;
      }

      y -= 10;

      const summaryX = 360;

      drawText("Subtotal", summaryX, y, 9);
      drawRightText(formatMoney(subtotal, currency), y, 9);
      y -= 19;

      drawText(`Tax (${taxRate}%)`, summaryX, y, 9);
      drawRightText(formatMoney(taxAmount, currency), y, 9);
      y -= 19;

      drawText(`Discount (${discountRate}%)`, summaryX, y, 9);
      drawRightText(formatMoney(discountAmount, currency), y, 9);
      y -= 25;

      page.drawLine({
        start: { x: summaryX, y: y + 10 },
        end: { x: right, y: y + 10 },
        thickness: 1,
        color: rgb(0.2, 0.22, 0.28),
      });

      drawText("TOTAL", summaryX, y - 5, 12, bold);
      drawRightText(formatMoney(total, currency), y - 5, 12, bold);

      y -= 65;

      if (paymentTerms.trim()) {
        drawText("PAYMENT TERMS", margin, y, 9, bold);
        y -= 17;

        const terms = paymentTerms.trim().slice(0, 180);
        drawText(terms, margin, y, 9);
        y -= 30;
      }

      if (notes.trim()) {
        drawText("NOTES", margin, y, 9, bold);
        y -= 17;

        const noteText = notes.trim().slice(0, 220);
        drawText(noteText, margin, y, 9);
      }

      const bytes = await pdf.save();

      const arrayBuffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(arrayBuffer).set(bytes);

      const blob = new Blob([arrayBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `${invoiceNumber || "invoice"}.pdf`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Workspace>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <ResultPanel>
            <div className="space-y-5">
              <div>
                <div className="text-lg font-semibold">Business details</div>
                <div className="mt-1 text-sm text-slate-400">
                  Add the information that should appear on your invoice.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name">
                  <TextInput
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Your Business"
                  />
                </Field>

                <Field label="Business email">
                  <TextInput
                    value={businessEmail}
                    onChange={(event) => setBusinessEmail(event.target.value)}
                    placeholder="hello@example.com"
                  />
                </Field>

                <Field label="Business phone">
                  <TextInput
                    value={businessPhone}
                    onChange={(event) => setBusinessPhone(event.target.value)}
                    placeholder="+234..."
                  />
                </Field>

                <Field label="Business address">
                  <TextInput
                    value={businessAddress}
                    onChange={(event) =>
                      setBusinessAddress(event.target.value)
                    }
                    placeholder="Business address"
                  />
                </Field>
              </div>
            </div>
          </ResultPanel>

          <ResultPanel>
            <div className="space-y-5">
              <div>
                <div className="text-lg font-semibold">Customer details</div>
                <div className="mt-1 text-sm text-slate-400">
                  Enter who the invoice is being issued to.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Customer name">
                  <TextInput
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer name"
                  />
                </Field>

                <Field label="Customer email">
                  <TextInput
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="customer@example.com"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Customer address">
                    <TextInput
                      value={customerAddress}
                      onChange={(event) =>
                        setCustomerAddress(event.target.value)
                      }
                      placeholder="Customer address"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </ResultPanel>

          <ResultPanel>
            <div className="space-y-5">
              <div>
                <div className="text-lg font-semibold">Invoice details</div>
                <div className="mt-1 text-sm text-slate-400">
                  Set the invoice number, dates, currency and adjustments.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Invoice number">
                  <TextInput
                    value={invoiceNumber}
                    onChange={(event) => setInvoiceNumber(event.target.value)}
                    placeholder="INV-001"
                  />
                </Field>

                <Field label="Currency">
                  <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
                  >
                    {currencyOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-slate-900 text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Invoice date">
                  <TextInput
                    type="date"
                    value={invoiceDate}
                    onChange={(event) => setInvoiceDate(event.target.value)}
                  />
                </Field>

                <Field label="Due date">
                  <TextInput
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                  />
                </Field>

                <Field label="Tax (%)">
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax}
                    onChange={(event) => setTax(event.target.value)}
                    placeholder="0"
                  />
                </Field>

                <Field label="Discount (%)">
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                    placeholder="0"
                  />
                </Field>
              </div>
            </div>
          </ResultPanel>

          <ResultPanel>
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">Items</div>
                  <div className="mt-1 text-sm text-slate-400">
                    Add everything you're charging the customer for.
                  </div>
                </div>

                <SecondaryButton onClick={addItem}>
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add item
                  </span>
                </SecondaryButton>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Item {index + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_120px_160px]">
                      <Field label="Description">
                        <TextInput
                          value={item.description}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "description",
                              event.target.value,
                            )
                          }
                          placeholder="Website design"
                        />
                      </Field>

                      <Field label="Quantity">
                        <TextInput
                          type="number"
                          min="0"
                          step="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "quantity",
                              event.target.value,
                            )
                          }
                        />
                      </Field>

                      <Field label={`Price (${currency})`}>
                        <TextInput
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(event) =>
                            updateItem(item.id, "price", event.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ResultPanel>

          <ResultPanel>
            <div className="space-y-5">
              <div>
                <div className="text-lg font-semibold">Notes & terms</div>
                <div className="mt-1 text-sm text-slate-400">
                  Optional information for the customer.
                </div>
              </div>

              <Field label="Payment terms">
                <textarea
                  value={paymentTerms}
                  onChange={(event) => setPaymentTerms(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/20"
                  placeholder="Payment is due by the due date."
                />
              </Field>

              <Field label="Notes">
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/20"
                  placeholder="Thank you for your business."
                />
              </Field>
            </div>
          </ResultPanel>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton onClick={downloadPdf} disabled={generating}>
              <span className="inline-flex items-center gap-2">
                {generating ? (
                  <FileText className="h-4 w-4 animate-pulse" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {generating ? "Generating..." : "Download PDF"}
              </span>
            </PrimaryButton>

            <SecondaryButton onClick={reset}>
              <span className="inline-flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset
              </span>
            </SecondaryButton>
          </div>

          <div className="text-xs text-slate-500">
            Your invoice data stays in your browser. Nothing is uploaded to
            NFMX.
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ResultPanel>
            <div className="rounded-xl bg-white p-6 text-slate-900 shadow-2xl">
              <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
                <div>
                  <div className="text-xl font-bold">
                    {businessName.trim() || "Your Business"}
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    {businessEmail.trim() && <div>{businessEmail}</div>}
                    {businessPhone.trim() && <div>{businessPhone}</div>}
                    {businessAddress.trim() && (
                      <div>{businessAddress}</div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold tracking-tight">
                    INVOICE
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    {invoiceNumber || "INV-001"}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Bill to
                  </div>

                  <div className="mt-2 text-sm font-semibold">
                    {customerName.trim() || "Customer"}
                  </div>

                  {customerEmail.trim() && (
                    <div className="mt-1 text-xs text-slate-500">
                      {customerEmail}
                    </div>
                  )}

                  {customerAddress.trim() && (
                    <div className="mt-1 text-xs text-slate-500">
                      {customerAddress}
                    </div>
                  )}
                </div>

                <div className="text-sm sm:text-right">
                  <div>
                    <span className="text-slate-400">Date:</span>{" "}
                    {invoiceDate || "—"}
                  </div>

                  <div className="mt-1">
                    <span className="text-slate-400">Due:</span>{" "}
                    {dueDate || "—"}
                  </div>
                </div>
              </div>

              <div className="py-5">
                <div className="grid grid-cols-[1fr_45px_80px_90px] gap-2 border-b border-slate-200 pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <div>Description</div>
                  <div>Qty</div>
                  <div>Price</div>
                  <div className="text-right">Amount</div>
                </div>

                <div>
                  {items.map((item) => {
                    const amount =
                      Math.max(0, item.quantity) * Math.max(0, item.price);

                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_45px_80px_90px] gap-2 border-b border-slate-100 py-3 text-xs"
                      >
                        <div className="truncate">
                          {item.description.trim() || "Item"}
                        </div>

                        <div>{item.quantity}</div>

                        <div>{formatMoney(item.price, currency)}</div>

                        <div className="text-right font-medium">
                          {formatMoney(amount, currency)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end border-b border-slate-200 pb-5">
                <div className="w-full max-w-[250px] space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span>{formatMoney(subtotal, currency)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Tax ({taxRate}%)
                    </span>
                    <span>{formatMoney(taxAmount, currency)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Discount ({discountRate}%)
                    </span>
                    <span>{formatMoney(discountAmount, currency)}</span>
                  </div>

                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
                    <span>Total</span>
                    <span>{formatMoney(total, currency)}</span>
                  </div>
                </div>
              </div>

              {(paymentTerms.trim() || notes.trim()) && (
                <div className="space-y-4 pt-5 text-xs text-slate-500">
                  {paymentTerms.trim() && (
                    <div>
                      <div className="font-bold uppercase tracking-wider text-slate-400">
                        Payment terms
                      </div>
                      <div className="mt-1">{paymentTerms}</div>
                    </div>
                  )}

                  {notes.trim() && (
                    <div>
                      <div className="font-bold uppercase tracking-wider text-slate-400">
                        Notes
                      </div>
                      <div className="mt-1">{notes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ResultPanel>
        </div>
      </div>
    </Workspace>
  );
}
