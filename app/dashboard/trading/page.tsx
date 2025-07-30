"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

export default function AngelOnePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderLoadingIds, setOrderLoadingIds] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [tradesLoading, setTradesLoading] = useState(true);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://localhost:4000/api";

  const [formData, setFormData] = useState({
    variety: "NORMAL",
    tradingsymbol: "SBIN-EQ",
    symboltoken: "3045",
    transactiontype: "BUY",
    exchange: "NSE",
    ordertype: "MARKET",
    producttype: "INTRADAY",
    duration: "DAY",
    price: "194.50",
    squareoff: "0",
    stoploss: "0",
    quantity: "1",
  });

  useEffect(() => {
    fetchProfile();
    fetchOrderHistory();
    fetchTradeHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${base_url}/user/AG-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    setOrdersLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${base_url}/user/order-book`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderHistory(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch order history", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchTradeHistory = async () => {
    setTradesLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${base_url}/user/trade-book`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTradeHistory(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch trade history", error);
    } finally {
      setTradesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.post(`${base_url}/user/place-order`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order placed successfully!");
      fetchOrderHistory();
    } catch (error) {
      console.error("Order failed", error);
      alert("Failed to place order.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelOrder = async (orderid: string) => {
    setOrderLoadingIds((prev) => [...prev, orderid]);
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${base_url}/user/cancel-order`,
        { orderid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order cancelled successfully!");
      fetchOrderHistory();
    } catch (error) {
      console.error("Cancel order failed", error);
      alert("Failed to cancel order.");
    } finally {
      setOrderLoadingIds((prev) => prev.filter((id) => id !== orderid));
    }
  };

  return (
    <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AngelOne</h1>
        <p className="text-gray-600">User Profile Overview</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between">
        {/* Left Side: Place Order */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Place Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm text-gray-500 block mb-1 capitalize">
                        {key}
                      </label>
                      <Input name={key} value={value} onChange={handleInputChange} placeholder={key} />
                    </div>
                  ))}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={formLoading}
                >
                  {formLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Profile */}
        <div className="w-full lg:w-1/3">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : profile ? (
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Client Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Client Code</p><p className="font-medium">{profile.clientcode}</p></div>
                  <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{profile.name}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{profile.email || "—"}</p></div>
                  <div><p className="text-sm text-gray-500">Mobile No.</p><p className="font-medium">{profile.mobileno || "—"}</p></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Exchanges</p>
                  <div className="flex gap-2 flex-wrap">
                    {profile.exchanges.map((exchange: string, index: number) => (
                      <Badge key={index} variant="outline">{exchange}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Products</p>
                  <div className="flex gap-2 flex-wrap">
                    {profile.products.map((product: string, index: number) => (
                      <Badge key={index} variant="outline">{product}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-red-500">Unable to load profile.</p>
          )}
        </div>
      </div>

      {/* Order History - Full Width */}
      <Card className="w-full border-gray-200 bg-white shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : orderHistory.length === 0 ? (
            <p className="text-gray-500">No order history found.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-auto">
              {orderHistory.map((order) => {
                const isCancelable = !["complete", "rejected", "cancelled"].includes(order.status?.toLowerCase?.());
                const isCancelling = orderLoadingIds.includes(order.orderid);
                return (
                  <div key={order.orderid} className="border rounded p-3 bg-gray-50 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-sm">{order.tradingsymbol} ({order.transactiontype})</h3>
                      <Badge
                        variant={
                          order.status === "complete"
                            ? "outline"
                            : order.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">Order ID: {order.orderid}</p>
                    <p className="text-xs text-gray-600">Quantity: {order.quantity} | Price: ₹{order.price}</p>
                    <p className="text-xs text-gray-600">Updated: {order.updatetime}</p>
                    {order.text && <p className="text-xs text-red-600 mt-1">{order.text}</p>}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2 self-start"
                      disabled={!isCancelable || isCancelling}
                      onClick={() => handleCancelOrder(order.orderid)}
                    >
                      {isCancelling ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        "Cancel Order"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trade History - Scrollable */}
      <Card className="w-full border-gray-200 bg-white shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          {tradesLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : tradeHistory.length === 0 ? (
            <p className="text-gray-500">No trades found.</p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
              {tradeHistory.map((trade, index) => (
                <div key={index} className="border rounded p-3 bg-gray-50 flex flex-col gap-1 text-xs text-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {trade.tradingsymbol} ({trade.transactiontype})
                    </span>
                    <Badge variant="secondary">{trade.exchange}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    <p><strong>Product:</strong> {trade.producttype}</p>
                    <p><strong>Group:</strong> {trade.symbolgroup}</p>
                    <p><strong>Lot:</strong> {trade.marketlot}</p>
                    <p><strong>Precision:</strong> {trade.precision}</p>
                    <p><strong>Multiplier:</strong> {trade.multiplier}</p>
                    <p><strong>Strike:</strong> {trade.strikeprice}</p>
                    <p><strong>Option:</strong> {trade.optiontype || "—"}</p>
                    <p><strong>Expiry:</strong> {trade.expirydate || "—"}</p>
                    <p><strong>Trade Value:</strong> ₹{trade.tradevalue}</p>
                    <p><strong>Fill Price:</strong> ₹{trade.fillprice}</p>
                    <p><strong>Fill Size:</strong> {trade.fillsize}</p>
                    <p><strong>Order ID:</strong> {trade.orderid}</p>
                    <p><strong>Fill ID:</strong> {trade.fillid}</p>
                    <p><strong>Time:</strong> {trade.filltime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
