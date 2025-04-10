import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useStorefrontProduct } from "@/frontend/hooks/useStorefrontProducts";
import { useCart } from "@/frontend/hooks/useCart";
import { ShoppingCart, Plus, Minus, Loader2, ArrowLeft } from "lucide-react";

interface ProductDetailProps {
  isRTL?: boolean;
  productId?: string