import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CreditCard, Truck, ShieldCheck } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type PaymentMethod = "credit_card" | "paypal" | "bank_transfer";

export default function Checkout() {
  const [orderItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 99.99,
      quantity: 1,
    },
    {
      id: "2",
      name: "Smart Watch Series 5",
      price: 49.99,
      quantity: 2,
    },
  ]);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically process the order
    alert("Order submitted successfully!");
  };

  const calculateSubtotal = () => {
    return orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTotal = () => {
    // Add shipping, tax, etc. if needed
    return calculateSubtotal();
  };

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-1"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-1"
                    >
                      State/Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium mb-1"
                    >
                      ZIP/Postal Code
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="credit_card"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label htmlFor="credit_card" className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                    <span>Credit Card</span>
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label htmlFor="paypal" className="flex items-center">
                    <span className="font-bold text-blue-600 mr-1">Pay</span>
                    <span className="font-bold text-blue-800">Pal</span>
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="bank_transfer"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label htmlFor="bank_transfer" className="flex items-center">
                    <span>Bank Transfer</span>
                  </label>
                </div>

                {paymentMethod === "credit_card" && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="cardExpiry"
                          className="block text-sm font-medium mb-1"
                        >
                          Expiration Date
                        </label>
                        <input
                          id="cardExpiry"
                          name="cardExpiry"
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          required={paymentMethod === "credit_card"}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cardCvc"
                          className="block text-sm font-medium mb-1"
                        >
                          CVC
                        </label>
                        <input
                          id="cardCvc"
                          name="cardCvc"
                          type="text"
                          placeholder="123"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          required={paymentMethod === "credit_card"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg border sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors flex items-center justify-center"
              onClick={handleSubmit}
            >
              <Check className="mr-2 h-5 w-5" /> Complete Order
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="mr-2 h-4 w-4" />
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Link
                to="/storefront/cart"
                className="text-primary hover:underline text-sm flex items-center"
              >
                &larr; Return to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
