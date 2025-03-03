{
  "enums": [
    {
      "name": "UserRole",
      "schema": "public",
      "values": [
        "ADMIN",
        "CUSTOMER"
      ]
    },
    {
      "name": "OrderStatus",
      "schema": "public",
      "values": [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED"
      ]
    },
    {
      "name": "PaymentStatus",
      "schema": "public",
      "values": [
        "PENDING",
        "VERIFIED",
        "REJECTED"
      ]
    },
    {
      "name": "PaymentMethod",
      "schema": "public",
      "values": [
        "GCASH",
        "CASH"
      ]
    },
    {
      "name": "VariantType",
      "schema": "public",
      "values": [
        "SIZE",
        "FLAVOR"
      ]
    }
  ],
  "tables": [
    {
      "name": "Category",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "name",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "description",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "imageUrl",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "sortOrder",
          "type": "integer",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "Category_pkey",
          "definition": "CREATE UNIQUE INDEX \"Category_pkey\" ON public.\"Category\" USING btree (id)"
        },
        {
          "name": "Category_name_key",
          "definition": "CREATE UNIQUE INDEX \"Category_name_key\" ON public.\"Category\" USING btree (name)"
        },
        {
          "name": "Category_sortOrder_idx",
          "definition": "CREATE INDEX \"Category_sortOrder_idx\" ON public.\"Category\" USING btree (\"sortOrder\")"
        }
      ],
      "policies": [
        {
          "name": "Admins can manage categories",
          "roles": [
            "authenticated"
          ],
          "table": "Category",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Categories are viewable by everyone",
          "roles": [
            "public"
          ],
          "table": "Category",
          "action": "SELECT",
          "schema": "public",
          "definition": "true"
        }
      ]
    },
    {
      "name": "Product",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "categoryId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "name",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "description",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "basePrice",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "imageUrl",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "isAvailable",
          "type": "boolean",
          "isNullable": false,
          "defaultValue": "true",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "allowsAddons",
          "type": "boolean",
          "isNullable": false,
          "defaultValue": "false",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "Product_pkey",
          "definition": "CREATE UNIQUE INDEX \"Product_pkey\" ON public.\"Product\" USING btree (id)"
        },
        {
          "name": "Product_categoryId_idx",
          "definition": "CREATE INDEX \"Product_categoryId_idx\" ON public.\"Product\" USING btree (\"categoryId\")"
        },
        {
          "name": "Product_isAvailable_idx",
          "definition": "CREATE INDEX \"Product_isAvailable_idx\" ON public.\"Product\" USING btree (\"isAvailable\")"
        },
        {
          "name": "Product_basePrice_idx",
          "definition": "CREATE INDEX \"Product_basePrice_idx\" ON public.\"Product\" USING btree (\"basePrice\")"
        }
      ],
      "policies": [
        {
          "name": "Admins can manage products",
          "roles": [
            "authenticated"
          ],
          "table": "Product",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Products are viewable by everyone",
          "roles": [
            "public"
          ],
          "table": "Product",
          "action": "SELECT",
          "schema": "public",
          "definition": "true"
        }
      ]
    },
    {
      "name": "Order",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "userId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "receiptId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "status",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": "'PENDING'::\"OrderStatus\"",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "paymentMethod",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "paymentStatus",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": "'PENDING'::\"PaymentStatus\"",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "totalAmount",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "Order_pkey",
          "definition": "CREATE UNIQUE INDEX \"Order_pkey\" ON public.\"Order\" USING btree (id)"
        },
        {
          "name": "Order_receiptId_key",
          "definition": "CREATE UNIQUE INDEX \"Order_receiptId_key\" ON public.\"Order\" USING btree (\"receiptId\")"
        },
        {
          "name": "Order_userId_idx",
          "definition": "CREATE INDEX \"Order_userId_idx\" ON public.\"Order\" USING btree (\"userId\")"
        },
        {
          "name": "Order_status_idx",
          "definition": "CREATE INDEX \"Order_status_idx\" ON public.\"Order\" USING btree (status)"
        },
        {
          "name": "Order_paymentStatus_idx",
          "definition": "CREATE INDEX \"Order_paymentStatus_idx\" ON public.\"Order\" USING btree (\"paymentStatus\")"
        },
        {
          "name": "Order_createdAt_idx",
          "definition": "CREATE INDEX \"Order_createdAt_idx\" ON public.\"Order\" USING btree (\"createdAt\")"
        },
        {
          "name": "Order_receiptId_idx",
          "definition": "CREATE INDEX \"Order_receiptId_idx\" ON public.\"Order\" USING btree (\"receiptId\")"
        }
      ],
      "policies": [
        {
          "name": "Admins can manage orders",
          "roles": [
            "authenticated"
          ],
          "table": "Order",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Users can create orders",
          "roles": [
            "authenticated"
          ],
          "table": "Order",
          "action": "INSERT",
          "schema": "public",
          "definition": null
        },
        {
          "name": "Users can view own orders",
          "roles": [
            "authenticated"
          ],
          "table": "Order",
          "action": "SELECT",
          "schema": "public",
          "definition": "((\"userId\" = (auth.uid())::text) OR (auth.is_admin() = true))"
        }
      ]
    },
    {
      "name": "OrderItem",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "orderId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "productId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "quantity",
          "type": "integer",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "price",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "productVariantId",
          "type": "text",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "OrderItem_pkey",
          "definition": "CREATE UNIQUE INDEX \"OrderItem_pkey\" ON public.\"OrderItem\" USING btree (id)"
        },
        {
          "name": "OrderItem_orderId_idx",
          "definition": "CREATE INDEX \"OrderItem_orderId_idx\" ON public.\"OrderItem\" USING btree (\"orderId\")"
        },
        {
          "name": "OrderItem_productId_idx",
          "definition": "CREATE INDEX \"OrderItem_productId_idx\" ON public.\"OrderItem\" USING btree (\"productId\")"
        }
      ],
      "policies": [
        {
          "name": "Users can create order items",
          "roles": [
            "authenticated"
          ],
          "table": "OrderItem",
          "action": "INSERT",
          "schema": "public",
          "definition": null
        },
        {
          "name": "Users can view own order items",
          "roles": [
            "authenticated"
          ],
          "table": "OrderItem",
          "action": "SELECT",
          "schema": "public",
          "definition": "((EXISTS ( SELECT 1\n   FROM \"Order\"\n  WHERE ((\"Order\".id = \"OrderItem\".\"orderId\") AND (\"Order\".\"userId\" = (auth.uid())::text)))) OR (auth.is_admin() = true))"
        }
      ]
    },
    {
      "name": "OrderItemAddon",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "orderItemId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "addonId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "quantity",
          "type": "integer",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "unitPrice",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "subtotal",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "OrderItemAddon_pkey",
          "definition": "CREATE UNIQUE INDEX \"OrderItemAddon_pkey\" ON public.\"OrderItemAddon\" USING btree (id)"
        },
        {
          "name": "OrderItemAddon_orderItemId_idx",
          "definition": "CREATE INDEX \"OrderItemAddon_orderItemId_idx\" ON public.\"OrderItemAddon\" USING btree (\"orderItemId\")"
        },
        {
          "name": "OrderItemAddon_addonId_idx",
          "definition": "CREATE INDEX \"OrderItemAddon_addonId_idx\" ON public.\"OrderItemAddon\" USING btree (\"addonId\")"
        }
      ],
      "policies": [
        {
          "name": "Users can create order item addons",
          "roles": [
            "authenticated"
          ],
          "table": "OrderItemAddon",
          "action": "INSERT",
          "schema": "public",
          "definition": null
        },
        {
          "name": "Users can view own order item addons",
          "roles": [
            "authenticated"
          ],
          "table": "OrderItemAddon",
          "action": "SELECT",
          "schema": "public",
          "definition": "((EXISTS ( SELECT 1\n   FROM (\"OrderItem\"\n     JOIN \"Order\" ON ((\"Order\".id = \"OrderItem\".\"orderId\")))\n  WHERE ((\"OrderItem\".id = \"OrderItemAddon\".\"orderItemId\") AND (\"Order\".\"userId\" = (auth.uid())::text)))) OR (auth.is_admin() = true))"
        }
      ]
    },
    {
      "name": "Payment",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "orderId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "amount",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "method",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "status",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": "'PENDING'::\"PaymentStatus\"",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "referenceNumber",
          "type": "text",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "screenshotUrl",
          "type": "text",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "verifiedBy",
          "type": "text",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "verificationTimestamp",
          "type": "timestamp without time zone",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "notes",
          "type": "text",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "Payment_pkey",
          "definition": "CREATE UNIQUE INDEX \"Payment_pkey\" ON public.\"Payment\" USING btree (id)"
        },
        {
          "name": "Payment_orderId_key",
          "definition": "CREATE UNIQUE INDEX \"Payment_orderId_key\" ON public.\"Payment\" USING btree (\"orderId\")"
        },
        {
          "name": "Payment_status_idx",
          "definition": "CREATE INDEX \"Payment_status_idx\" ON public.\"Payment\" USING btree (status)"
        },
        {
          "name": "Payment_method_idx",
          "definition": "CREATE INDEX \"Payment_method_idx\" ON public.\"Payment\" USING btree (method)"
        },
        {
          "name": "Payment_referenceNumber_idx",
          "definition": "CREATE INDEX \"Payment_referenceNumber_idx\" ON public.\"Payment\" USING btree (\"referenceNumber\")"
        },
        {
          "name": "Payment_verifiedBy_idx",
          "definition": "CREATE INDEX \"Payment_verifiedBy_idx\" ON public.\"Payment\" USING btree (\"verifiedBy\")"
        },
        {
          "name": "Payment_createdAt_idx",
          "definition": "CREATE INDEX \"Payment_createdAt_idx\" ON public.\"Payment\" USING btree (\"createdAt\")"
        }
      ],
      "policies": [
        {
          "name": "Admins can manage payments",
          "roles": [
            "authenticated"
          ],
          "table": "Payment",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Users can create payments",
          "roles": [
            "authenticated"
          ],
          "table": "Payment",
          "action": "INSERT",
          "schema": "public",
          "definition": null
        },
        {
          "name": "Users can view own payments",
          "roles": [
            "authenticated"
          ],
          "table": "Payment",
          "action": "SELECT",
          "schema": "public",
          "definition": "((EXISTS ( SELECT 1\n   FROM \"Order\"\n  WHERE ((\"Order\".id = \"Payment\".\"orderId\") AND (\"Order\".\"userId\" = (auth.uid())::text)))) OR (auth.is_admin() = true))"
        }
      ]
    },
    {
      "name": "User",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "email",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "fullName",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "phoneNumber",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "address",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "role",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": "'CUSTOMER'::\"UserRole\"",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "User_pkey",
          "definition": "CREATE UNIQUE INDEX \"User_pkey\" ON public.\"User\" USING btree (id)"
        },
        {
          "name": "User_email_key",
          "definition": "CREATE UNIQUE INDEX \"User_email_key\" ON public.\"User\" USING btree (email)"
        },
        {
          "name": "User_email_idx",
          "definition": "CREATE INDEX \"User_email_idx\" ON public.\"User\" USING btree (email)"
        },
        {
          "name": "User_role_idx",
          "definition": "CREATE INDEX \"User_role_idx\" ON public.\"User\" USING btree (role)"
        }
      ],
      "policies": [
        {
          "name": "Admins can view all data",
          "roles": [
            "authenticated"
          ],
          "table": "User",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Users can update own data",
          "roles": [
            "authenticated"
          ],
          "table": "User",
          "action": "UPDATE",
          "schema": "public",
          "definition": "(id = (auth.uid())::text)"
        },
        {
          "name": "Users can view own data",
          "roles": [
            "authenticated"
          ],
          "table": "User",
          "action": "SELECT",
          "schema": "public",
          "definition": "((id = (auth.uid())::text) OR (auth.is_admin() = true))"
        }
      ]
    },
    {
      "name": "ProductVariant",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "productId",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": true,
          "isPrimaryKey": true
        },
        {
          "name": "type",
          "type": "USER-DEFINED",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "name",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "price",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "imageUrl",
          "type": "text",
          "isNullable": true,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "stock",
          "type": "integer",
          "isNullable": false,
          "defaultValue": "0",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "isAvailable",
          "type": "boolean",
          "isNullable": false,
          "defaultValue": "true",
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "ProductVariant_pkey",
          "definition": "CREATE UNIQUE INDEX \"ProductVariant_pkey\" ON public.\"ProductVariant\" USING btree (id)"
        },
        {
          "name": "ProductVariant_productId_idx",
          "definition": "CREATE INDEX \"ProductVariant_productId_idx\" ON public.\"ProductVariant\" USING btree (\"productId\")"
        },
        {
          "name": "ProductVariant_type_idx",
          "definition": "CREATE INDEX \"ProductVariant_type_idx\" ON public.\"ProductVariant\" USING btree (type)"
        },
        {
          "name": "ProductVariant_price_idx",
          "definition": "CREATE INDEX \"ProductVariant_price_idx\" ON public.\"ProductVariant\" USING btree (price)"
        },
        {
          "name": "product_variants_stock_idx",
          "definition": "CREATE INDEX product_variants_stock_idx ON public.\"ProductVariant\" USING btree (stock)"
        },
        {
          "name": "product_variants_isAvailable_idx",
          "definition": "CREATE INDEX \"product_variants_isAvailable_idx\" ON public.\"ProductVariant\" USING btree (\"isAvailable\")"
        }
      ],
      "policies": [
        {
          "name": "Admin full access for variants",
          "roles": [
            "authenticated"
          ],
          "table": "ProductVariant",
          "action": "ALL",
          "schema": "public",
          "definition": "(EXISTS ( SELECT 1\n   FROM \"User\"\n  WHERE ((\"User\".id = (auth.uid())::text) AND (\"User\".role = 'ADMIN'::\"UserRole\"))))"
        },
        {
          "name": "Admins can manage product variants",
          "roles": [
            "authenticated"
          ],
          "table": "ProductVariant",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Product variants are viewable by everyone",
          "roles": [
            "public"
          ],
          "table": "ProductVariant",
          "action": "SELECT",
          "schema": "public",
          "definition": "true"
        },
        {
          "name": "Public read access for variants",
          "roles": [
            "public"
          ],
          "table": "ProductVariant",
          "action": "SELECT",
          "schema": "public",
          "definition": "true"
        }
      ]
    },
    {
      "name": "GlobalAddon",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": true
        },
        {
          "name": "name",
          "type": "text",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "price",
          "type": "double precision",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "isAvailable",
          "type": "boolean",
          "isNullable": false,
          "defaultValue": "true",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "createdAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": "CURRENT_TIMESTAMP",
          "isForeignKey": false,
          "isPrimaryKey": false
        },
        {
          "name": "updatedAt",
          "type": "timestamp without time zone",
          "isNullable": false,
          "defaultValue": null,
          "isForeignKey": false,
          "isPrimaryKey": false
        }
      ],
      "indexes": [
        {
          "name": "GlobalAddon_pkey",
          "definition": "CREATE UNIQUE INDEX \"GlobalAddon_pkey\" ON public.\"GlobalAddon\" USING btree (id)"
        },
        {
          "name": "GlobalAddon_isAvailable_idx",
          "definition": "CREATE INDEX \"GlobalAddon_isAvailable_idx\" ON public.\"GlobalAddon\" USING btree (\"isAvailable\")"
        },
        {
          "name": "GlobalAddon_price_idx",
          "definition": "CREATE INDEX \"GlobalAddon_price_idx\" ON public.\"GlobalAddon\" USING btree (price)"
        }
      ],
      "policies": [
        {
          "name": "Admins can manage global addons",
          "roles": [
            "authenticated"
          ],
          "table": "GlobalAddon",
          "action": "ALL",
          "schema": "public",
          "definition": "(auth.is_admin() = true)"
        },
        {
          "name": "Global addons are viewable by everyone",
          "roles": [
            "public"
          ],
          "table": "GlobalAddon",
          "action": "SELECT",
          "schema": "public",
          "definition": "true"
        }
      ]
    }
  ],
  "storage": {
    "buckets": [
      {
        "id": "images",
        "name": "images",
        "owner": null,
        "public": true,
        "objects": [
          {
            "name": "products/beef-chaofan.png",
            "size": "204025",
            "owner": null,
            "metadata": {
              "eTag": "\"774ab29fd811c68702cff6b1ed568217-1\"",
              "size": 204025,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 204025,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.403446+00:00",
            "updated_at": "2025-02-05T14:41:04.403446+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.403446+00:00"
          },
          {
            "name": "products/graham-bar.png",
            "size": "273872",
            "owner": null,
            "metadata": {
              "eTag": "\"052306adf4cfc53952a3a832f5c5d468-1\"",
              "size": 273872,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 273872,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.444164+00:00",
            "updated_at": "2025-02-05T14:41:04.444164+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.444164+00:00"
          },
          {
            "name": "products/beef-mami.png",
            "size": "326994",
            "owner": null,
            "metadata": {
              "eTag": "\"dd2747e58e00205256f7ad9e0e559051-1\"",
              "size": 326994,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 326994,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.624535+00:00",
            "updated_at": "2025-02-05T14:41:04.624535+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.624535+00:00"
          },
          {
            "name": "products/hotsilog.png",
            "size": "257567",
            "owner": null,
            "metadata": {
              "eTag": "\"3d7cf6ca8ac60c699431bd7ade59a01a-1\"",
              "size": 257567,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 257567,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.838458+00:00",
            "updated_at": "2025-02-05T14:41:06.838458+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.838458+00:00"
          },
          {
            "name": "products/pares.png",
            "size": "257488",
            "owner": null,
            "metadata": {
              "eTag": "\"1787538d248fe58fc209c1deb37d8f77-1\"",
              "size": 257488,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 257488,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.877803+00:00",
            "updated_at": "2025-02-05T14:41:06.877803+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.877803+00:00"
          },
          {
            "name": "products/pastil.png",
            "size": "179682",
            "owner": null,
            "metadata": {
              "eTag": "\"dda8d464a53983d2c1fb203ac4701658-1\"",
              "size": 179682,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 179682,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.951741+00:00",
            "updated_at": "2025-02-05T14:41:06.951741+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.951741+00:00"
          },
          {
            "name": "products/shanghai-rice.png",
            "size": "110745",
            "owner": null,
            "metadata": {
              "eTag": "\"3e6a015f2c7ec30beb2f7d00ca031c95-1\"",
              "size": 110745,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 110745,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.114338+00:00",
            "updated_at": "2025-02-05T14:41:08.114338+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.114338+00:00"
          },
          {
            "name": "products/waffle.png",
            "size": "313168",
            "owner": null,
            "metadata": {
              "eTag": "\"dc75b0aae475b8b8d46a068b8a9ddc74-1\"",
              "size": 313168,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 313168,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.198406+00:00",
            "updated_at": "2025-02-05T14:41:08.198406+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.198406+00:00"
          },
          {
            "name": "products/tocilog.png",
            "size": "248774",
            "owner": null,
            "metadata": {
              "eTag": "\"99e90ef74fadc0f9d04e6c45a6c35cc4-1\"",
              "size": 248774,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 248774,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.551582+00:00",
            "updated_at": "2025-02-05T14:41:08.551582+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.551582+00:00"
          },
          {
            "name": "variants/greenapple-22oz.png",
            "size": "113207",
            "owner": null,
            "metadata": {
              "eTag": "\"aba68cf7ad262d882f02f974f03345a5-1\"",
              "size": 113207,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 113207,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.642448+00:00",
            "updated_at": "2025-02-05T14:41:10.642448+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.642448+00:00"
          },
          {
            "name": "variants/lychee-16oz.png",
            "size": "64364",
            "owner": null,
            "metadata": {
              "eTag": "\"c3c9755b09804e278c4f2529e3d1f6e5-1\"",
              "size": 64364,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 64364,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.668018+00:00",
            "updated_at": "2025-02-05T14:41:10.668018+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.668018+00:00"
          },
          {
            "name": "variants/greenapple-16oz.png",
            "size": "68185",
            "owner": null,
            "metadata": {
              "eTag": "\"55310712842bda32e69ee7344cf1a0ed-1\"",
              "size": 68185,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 68185,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.670957+00:00",
            "updated_at": "2025-02-05T14:41:10.670957+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.670957+00:00"
          },
          {
            "name": "categories/silog-meals.png",
            "size": "426924",
            "owner": null,
            "metadata": {
              "eTag": "\"23490f88e8e16014cea493153939dbac-1\"",
              "size": 426924,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:15.000Z",
              "contentLength": 426924,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:15.11397+00:00",
            "updated_at": "2025-02-05T14:41:15.11397+00:00",
            "last_accessed_at": "2025-02-05T14:41:15.11397+00:00"
          },
          {
            "name": "categories/ala-carte.png",
            "size": "767899",
            "owner": null,
            "metadata": {
              "eTag": "\"673d8b94ff4ee2a998c07d5bbc8f4c72-1\"",
              "size": 767899,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:15.000Z",
              "contentLength": 767899,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:15.232002+00:00",
            "updated_at": "2025-02-05T14:41:15.232002+00:00",
            "last_accessed_at": "2025-02-05T14:41:15.232002+00:00"
          },
          {
            "name": "categories/budget-meals.png",
            "size": "1291608",
            "owner": null,
            "metadata": {
              "eTag": "\"b8d1f1d0352ce3f7dec9b79adb74f950-1\"",
              "size": 1291608,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:16.000Z",
              "contentLength": 1291608,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:16.036913+00:00",
            "updated_at": "2025-02-05T14:41:16.036913+00:00",
            "last_accessed_at": "2025-02-05T14:41:16.036913+00:00"
          },
          {
            "name": "products/chicksilog.png",
            "size": "213015",
            "owner": null,
            "metadata": {
              "eTag": "\"f7c56d06aa53cb0b773f2802850a17a4-1\"",
              "size": 213015,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 213015,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.59164+00:00",
            "updated_at": "2025-02-05T14:41:04.59164+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.59164+00:00"
          },
          {
            "name": "products/cheese-stick.png",
            "size": "276718",
            "owner": null,
            "metadata": {
              "eTag": "\"85841c397ad5d221bc37549682cff090-1\"",
              "size": 276718,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 276718,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.719342+00:00",
            "updated_at": "2025-02-05T14:41:04.719342+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.719342+00:00"
          },
          {
            "name": "products/fries.png",
            "size": "2027248",
            "owner": null,
            "metadata": {
              "eTag": "\"a5e8fede955642ce9130edd88f899ae1-1\"",
              "size": 2027248,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:06.000Z",
              "contentLength": 2027248,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:05.531847+00:00",
            "updated_at": "2025-02-05T14:41:05.531847+00:00",
            "last_accessed_at": "2025-02-05T14:41:05.531847+00:00"
          },
          {
            "name": "products/hot-coffee.png",
            "size": "69125",
            "owner": null,
            "metadata": {
              "eTag": "\"5d19f40e5d875b5b327ac1d167e0d52f-1\"",
              "size": 69125,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 69125,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.337111+00:00",
            "updated_at": "2025-02-05T14:41:06.337111+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.337111+00:00"
          },
          {
            "name": "products/porksilog.png",
            "size": "256776",
            "owner": null,
            "metadata": {
              "eTag": "\"c0bed243da5c2a249c8ba4fdf9efe861-1\"",
              "size": 256776,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 256776,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.662215+00:00",
            "updated_at": "2025-02-05T14:41:06.662215+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.662215+00:00"
          },
          {
            "name": "products/logo.png",
            "size": "634437",
            "owner": null,
            "metadata": {
              "eTag": "\"330844c04bcf14abb31e236e5b4af34d-1\"",
              "size": 634437,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 634437,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:07.183511+00:00",
            "updated_at": "2025-02-05T14:41:07.183511+00:00",
            "last_accessed_at": "2025-02-05T14:41:07.183511+00:00"
          },
          {
            "name": "products/skinless-rice.png",
            "size": "127485",
            "owner": null,
            "metadata": {
              "eTag": "\"d88a11935a44cd02f8ba6e1b486cfcc7-1\"",
              "size": 127485,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 127485,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:07.99376+00:00",
            "updated_at": "2025-02-05T14:41:07.99376+00:00",
            "last_accessed_at": "2025-02-05T14:41:07.99376+00:00"
          },
          {
            "name": "products/siomai-rice.png",
            "size": "133785",
            "owner": null,
            "metadata": {
              "eTag": "\"243d1800dead31d70151c5d5583bfce8-1\"",
              "size": 133785,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 133785,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.272924+00:00",
            "updated_at": "2025-02-05T14:41:08.272924+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.272924+00:00"
          },
          {
            "name": "products/silog.png",
            "size": "343509",
            "owner": null,
            "metadata": {
              "eTag": "\"1d575a141c1213f48da5fce0622729d5-1\"",
              "size": 343509,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:09.000Z",
              "contentLength": 343509,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.672094+00:00",
            "updated_at": "2025-02-05T14:41:08.672094+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.672094+00:00"
          },
          {
            "name": "variants/strawberry-16oz.png",
            "size": "95700",
            "owner": null,
            "metadata": {
              "eTag": "\"5326c93432f45a6719c80003ceb0aa10-1\"",
              "size": 95700,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 95700,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.690675+00:00",
            "updated_at": "2025-02-05T14:41:10.690675+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.690675+00:00"
          },
          {
            "name": "variants/blueberry-22oz.png",
            "size": "130291",
            "owner": null,
            "metadata": {
              "eTag": "\"fe2602f6d681f70be3a1fb45f6aad501-1\"",
              "size": 130291,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 130291,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.75501+00:00",
            "updated_at": "2025-02-05T14:41:10.75501+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.75501+00:00"
          },
          {
            "name": "variants/siomai-chicken.png",
            "size": "123311",
            "owner": null,
            "metadata": {
              "eTag": "\"c893ef5f6d20a8a53a1d6f0b22b8baac-1\"",
              "size": 123311,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 123311,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.80167+00:00",
            "updated_at": "2025-02-05T14:41:10.80167+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.80167+00:00"
          },
          {
            "name": "variants/blueberry-16oz.png",
            "size": "104572",
            "owner": null,
            "metadata": {
              "eTag": "\"fe5af7148a0a7fcde57d94329e062a20-1\"",
              "size": 104572,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 104572,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.835348+00:00",
            "updated_at": "2025-02-05T14:41:10.835348+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.835348+00:00"
          },
          {
            "name": "variants/lemon-16oz.png",
            "size": "69456",
            "owner": null,
            "metadata": {
              "eTag": "\"272e22d099cf77ee527119d718425177-1\"",
              "size": 69456,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 69456,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.961271+00:00",
            "updated_at": "2025-02-05T14:41:10.961271+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.961271+00:00"
          },
          {
            "name": "products/egg.png",
            "size": "144324",
            "owner": null,
            "metadata": {
              "eTag": "\"63ce65a32d62be6f8e11bd7b5953771c-1\"",
              "size": 144324,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 144324,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.429968+00:00",
            "updated_at": "2025-02-05T14:41:04.429968+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.429968+00:00"
          },
          {
            "name": "products/goto.png",
            "size": "455897",
            "owner": null,
            "metadata": {
              "eTag": "\"29cd44d8dd9f83d69004e9ab69551879-1\"",
              "size": 455897,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 455897,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.462365+00:00",
            "updated_at": "2025-02-05T14:41:04.462365+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.462365+00:00"
          },
          {
            "name": "products/fruit-soda.png",
            "size": "150385",
            "owner": null,
            "metadata": {
              "eTag": "\"8ff9807a5933850d84b8d8627947c1ac-1\"",
              "size": 150385,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 150385,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.528588+00:00",
            "updated_at": "2025-02-05T14:41:04.528588+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.528588+00:00"
          },
          {
            "name": "products/bangsilog.png",
            "size": "257833",
            "owner": null,
            "metadata": {
              "eTag": "\"85069dbd65473a4080e6ee3f36b498bb-1\"",
              "size": 257833,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:04.000Z",
              "contentLength": 257833,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:04.644658+00:00",
            "updated_at": "2025-02-05T14:41:04.644658+00:00",
            "last_accessed_at": "2025-02-05T14:41:04.644658+00:00"
          },
          {
            "name": "products/iced-coffee.png",
            "size": "141782",
            "owner": null,
            "metadata": {
              "eTag": "\"6be1304b8bf913295961b2365c1505d6-1\"",
              "size": 141782,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 141782,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.434937+00:00",
            "updated_at": "2025-02-05T14:41:06.434937+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.434937+00:00"
          },
          {
            "name": "products/hamsilog.png",
            "size": "190711",
            "owner": null,
            "metadata": {
              "eTag": "\"be2410f7fd666211647328fa3c794413-1\"",
              "size": 190711,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 190711,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.470789+00:00",
            "updated_at": "2025-02-05T14:41:06.470789+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.470789+00:00"
          },
          {
            "name": "products/pork-chaofan.png",
            "size": "204025",
            "owner": null,
            "metadata": {
              "eTag": "\"774ab29fd811c68702cff6b1ed568217-1\"",
              "size": 204025,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 204025,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.613018+00:00",
            "updated_at": "2025-02-05T14:41:06.613018+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.613018+00:00"
          },
          {
            "name": "products/lugaw.png",
            "size": "195611",
            "owner": null,
            "metadata": {
              "eTag": "\"dbc80b7e9055b2da9e7bb3efa8f449a3-1\"",
              "size": 195611,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:07.000Z",
              "contentLength": 195611,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:06.994314+00:00",
            "updated_at": "2025-02-05T14:41:06.994314+00:00",
            "last_accessed_at": "2025-02-05T14:41:06.994314+00:00"
          },
          {
            "name": "products/tapsilog.png",
            "size": "234039",
            "owner": null,
            "metadata": {
              "eTag": "\"33ea3febdd350ae1c8de922dff473149-1\"",
              "size": 234039,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 234039,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.069685+00:00",
            "updated_at": "2025-02-05T14:41:08.069685+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.069685+00:00"
          },
          {
            "name": "products/sisigsilog.png",
            "size": "124131",
            "owner": null,
            "metadata": {
              "eTag": "\"dafa67f7a40913c625601a68dc6ce066-1\"",
              "size": 124131,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 124131,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.105928+00:00",
            "updated_at": "2025-02-05T14:41:08.105928+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.105928+00:00"
          },
          {
            "name": "products/rice.png",
            "size": "194920",
            "owner": null,
            "metadata": {
              "eTag": "\"39338b8ed95140243c52fe8be02e59ca-1\"",
              "size": 194920,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:08.000Z",
              "contentLength": 194920,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:08.215676+00:00",
            "updated_at": "2025-02-05T14:41:08.215676+00:00",
            "last_accessed_at": "2025-02-05T14:41:08.215676+00:00"
          },
          {
            "name": "variants/lemon-22oz.png",
            "size": "99430",
            "owner": null,
            "metadata": {
              "eTag": "\"08748670b5c471334daf73ca5c0d787e-1\"",
              "size": 99430,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 99430,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:10.827226+00:00",
            "updated_at": "2025-02-05T14:41:10.827226+00:00",
            "last_accessed_at": "2025-02-05T14:41:10.827226+00:00"
          },
          {
            "name": "variants/coke-float-16oz.png",
            "size": "432266",
            "owner": null,
            "metadata": {
              "eTag": "\"094fe7f5b5efada3bb48da5a3b0a5d90-1\"",
              "size": 432266,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:11.000Z",
              "contentLength": 432266,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:11.053421+00:00",
            "updated_at": "2025-02-05T14:41:11.053421+00:00",
            "last_accessed_at": "2025-02-05T14:41:11.053421+00:00"
          },
          {
            "name": "variants/strawberry-22oz.png",
            "size": "138689",
            "owner": null,
            "metadata": {
              "eTag": "\"95688a5a05cdc4ab5d12ce7f9548a773-1\"",
              "size": 138689,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:12.000Z",
              "contentLength": 138689,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:12.06442+00:00",
            "updated_at": "2025-02-05T14:41:12.06442+00:00",
            "last_accessed_at": "2025-02-05T14:41:12.06442+00:00"
          },
          {
            "name": "categories/beverages.png",
            "size": "442340",
            "owner": null,
            "metadata": {
              "eTag": "\"d779785a536a9820fa66ecd9da8c909b-1\"",
              "size": 442340,
              "mimetype": "image/png",
              "cacheControl": "max-age=3600",
              "lastModified": "2025-02-05T14:41:15.000Z",
              "contentLength": 442340,
              "httpStatusCode": 200
            },
            "mimetype": "image/png",
            "bucket_id": "images",
            "created_at": "2025-02-05T14:41:15.042381+00:00",
            "updated_at": "2025-02-05T14:41:15.042381+00:00",
            "last_accessed_at": "2025-02-05T14:41:15.042381+00:00"
          }
        ],
        "created_at": "2025-01-16T15:25:39.127115+00:00",
        "updated_at": "2025-01-16T15:25:39.127115+00:00"
      }
    ],
    "total_size": 12916313,
    "object_count": 44
  },
  "triggers": null,
  "functions": [
    {
      "name": "get_database_state",
      "schema": "public",
      "language": "plpgsql",
      "arguments": "",
      "returnType": "jsonb"
    },
    {
      "name": "exec_sql",
      "schema": "public",
      "language": "plpgsql",
      "arguments": "sql text",
      "returnType": "void"
    }
  ],
  "table_contents": {
    "User": [
      {
        "id": "d1e57514-df12-4104-b376-2b044c6cf7b0",
        "role": "ADMIN",
        "email": "kusinadeamadeo@gmail.com",
        "address": "",
        "fullName": "Kusina De Amadeo",
        "createdAt": "2025-01-16T06:49:44.057",
        "updatedAt": "2025-01-16T06:49:44.057",
        "phoneNumber": ""
      },
      {
        "id": "dc7d3edf-b728-470e-9c5f-2e59ddae8b33",
        "role": "CUSTOMER",
        "email": "marquezjohnnathanieljade@gmail.com",
        "address": "",
        "fullName": "John Nathaniel Marquez",
        "createdAt": "2025-01-16T06:50:26.151",
        "updatedAt": "2025-01-16T06:50:26.151",
        "phoneNumber": ""
      },
      {
        "id": "8c16079e-6885-4fe5-b39f-07fdc42cd798",
        "role": "CUSTOMER",
        "email": "ulvkookly20@gmail.com",
        "address": "",
        "fullName": "T1nker",
        "createdAt": "2025-01-16T08:08:13.449",
        "updatedAt": "2025-01-16T08:08:13.449",
        "phoneNumber": ""
      }
    ],
    "Order": [],
    "Payment": [],
    "Product": [
      {
        "id": "8267c7ab-96d7-4b3c-b94f-8aaaad7a8dcf",
        "name": "Pork Chaofan",
        "imageUrl": "/images/products/pork-chaofan.png",
        "basePrice": 45,
        "createdAt": "2025-01-16T15:08:00.749",
        "updatedAt": "2025-01-16T15:08:00.749",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Pork Fried Rice Chinese Style",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "db9b5609-831f-4fe1-9d09-a1d5261baeb0",
        "name": "Hotsilog",
        "imageUrl": "/images/products/hotsilog.png",
        "basePrice": 60,
        "createdAt": "2025-01-16T15:08:00.748",
        "updatedAt": "2025-01-16T15:08:00.748",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Hotdog with Sinangag (Fried Rice) and Itlog (Egg)",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "3a9e775b-a6b4-46af-9b30-de3b7ac057b1",
        "name": "Silog",
        "imageUrl": "/images/products/silog.png",
        "basePrice": 35,
        "createdAt": "2025-01-16T15:08:00.748",
        "updatedAt": "2025-01-16T15:08:00.748",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Sinangag (Fried Rice) and Itlog (Egg)",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "4d4b8d9c-0893-4770-8fa6-9b2bd2477687",
        "name": "Hamsilog",
        "imageUrl": "/images/products/hamsilog.png",
        "basePrice": 55,
        "createdAt": "2025-01-16T15:08:00.748",
        "updatedAt": "2025-01-16T15:08:00.748",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Ham with Sinangag (Fried Rice) and Itlog (Egg)",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "12b88a22-9689-4e33-9bb3-3c0b8b8df21c",
        "name": "Beef Chaofan",
        "imageUrl": "/images/products/beef-chaofan.png",
        "basePrice": 50,
        "createdAt": "2025-01-16T15:08:00.749",
        "updatedAt": "2025-01-16T15:08:00.749",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Beef Fried Rice Chinese Style",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "ca44648f-4216-4a4b-b3c4-a044e5419c6d",
        "name": "Shanghai Rice",
        "imageUrl": "/images/products/shanghai-rice.png",
        "basePrice": 39,
        "createdAt": "2025-01-16T15:08:00.749",
        "updatedAt": "2025-01-16T15:08:00.749",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Lumpia Shanghai with Rice",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "d6728ef8-627a-4da9-a6ae-ab1ace5ec660",
        "name": "Skinless Rice",
        "imageUrl": "/images/products/skinless-rice.png",
        "basePrice": 40,
        "createdAt": "2025-01-16T15:08:00.749",
        "updatedAt": "2025-01-16T15:08:00.749",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Skinless Longganisa with Fried Rice",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "9f1d864c-98f6-4217-b462-bdba498f03e9",
        "name": "Siomai Rice",
        "imageUrl": "/images/products/siomai-rice.png",
        "basePrice": 39,
        "createdAt": "2025-01-16T15:08:00.749",
        "updatedAt": "2025-01-16T15:08:00.749",
        "categoryId": "43f716fb-536b-491d-bacd-efe88594821b",
        "description": "Siomai with Fried Rice",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "3d3c8dfe-0e9a-41bb-bd10-22e8727f4746",
        "name": "Tocilog",
        "imageUrl": "/images/products/tocilog.png",
        "basePrice": 85,
        "createdAt": "2025-01-16T15:08:01.965",
        "updatedAt": "2025-01-16T15:08:01.965",
        "categoryId": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "description": "Tocino with Sinangag and Itlog",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "35ba688f-5a00-4264-9928-58bfd86adf9e",
        "name": "Bangsilog",
        "imageUrl": "/images/products/bangsilog.png",
        "basePrice": 100,
        "createdAt": "2025-01-16T15:08:01.965",
        "updatedAt": "2025-01-16T15:08:01.965",
        "categoryId": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "description": "Bangus with Sinangag and Itlog",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "f602f318-dcee-44ea-8616-78155a306fcf",
        "name": "Chicksilog",
        "imageUrl": "/images/products/chicksilog.png",
        "basePrice": 95,
        "createdAt": "2025-01-16T15:08:01.965",
        "updatedAt": "2025-01-16T15:08:01.965",
        "categoryId": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "description": "Chicken with Sinangag and Itlog",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "6e38ad41-1b97-4255-b3a9-5ce6c035a078",
        "name": "Porksilog",
        "imageUrl": "/images/products/porksilog.png",
        "basePrice": 95,
        "createdAt": "2025-01-16T15:08:01.965",
        "updatedAt": "2025-01-16T15:08:01.965",
        "categoryId": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "description": "Porkchop with Sinangag and Itlog",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "817182f6-83a5-4fee-b04d-2b61110c350b",
        "name": "Tapsilog",
        "imageUrl": "/images/products/tapsilog.png",
        "basePrice": 100,
        "createdAt": "2025-01-16T15:08:01.965",
        "updatedAt": "2025-01-16T15:08:01.965",
        "categoryId": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "description": "Beef Tapa with Sinangag and Itlog",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "4efc82e7-fb0c-48d8-a735-aafea2cecced",
        "name": "Sisigsilog",
        "imageUrl": "/images/products/sisigsilog.png",
        "basePrice": 95,
        "createdAt": "2025-01-16T15:08:01.965",
        "updatedAt": "2025-01-16T15:08:01.965",
        "categoryId": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "description": "Sisig with Sinangag and Itlog",
        "isAvailable": true,
        "allowsAddons": true
      },
      {
        "id": "22431056-f360-49e6-9231-b840da31af19",
        "name": "Beef Mami",
        "imageUrl": "/images/products/beef-mami.png",
        "basePrice": 45,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Beef Noodle Soup",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "3311eae5-98cd-4a85-a689-c5b657f024c4",
        "name": "Fries",
        "imageUrl": "/images/products/fries.png",
        "basePrice": 25,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Crispy French Fries",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "fa6e8087-fe7e-4136-ae58-8d067a44830f",
        "name": "Waffle",
        "imageUrl": "/images/products/waffle.png",
        "basePrice": 0,
        "createdAt": "2025-01-16T15:08:02.752",
        "updatedAt": "2025-01-16T15:08:02.752",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Fresh Baked Waffle",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "ab544d61-c698-42a8-af55-ee72435c0e0b",
        "name": "Siomai",
        "imageUrl": "/images/products/siomai-rice.png",
        "basePrice": 0,
        "createdAt": "2025-01-16T15:08:03.257",
        "updatedAt": "2025-01-16T15:08:03.257",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Chinese-style Siomai",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "d77a9343-6be2-4f6b-a0a3-eaf14a144098",
        "name": "Cheese Stick",
        "imageUrl": "/images/products/cheese-stick.png",
        "basePrice": 10,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Crispy Cheese Stick (6 pieces per order)",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "5c4ad920-cdcb-4aed-8e40-1b4f5d7b0b34",
        "name": "Graham Bar",
        "imageUrl": "/images/products/graham-bar.png",
        "basePrice": 20,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Graham Cracker Dessert Bar",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "6fa93822-d5c6-4eb0-afa9-ea3d0e53bc2a",
        "name": "Pares",
        "imageUrl": "/images/products/pares.png",
        "basePrice": 60,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Beef Stew with Rice",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "e5375186-36c7-4842-8b75-2c5a00048d10",
        "name": "Coke Float",
        "imageUrl": "/images/products/fruit-soda.png",
        "basePrice": 0,
        "createdAt": "2025-01-16T15:08:05.385",
        "updatedAt": "2025-01-16T15:08:05.385",
        "categoryId": "18971bbb-5e8f-4c1e-8306-82a5e7e927b2",
        "description": "Coca-Cola with Ice Cream",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "d39ec9e0-7667-432a-8717-2ec1eefab0e3",
        "name": "Iced Coffee",
        "imageUrl": "/images/products/iced-coffee.png",
        "basePrice": 29,
        "createdAt": "2025-01-16T15:08:06.375",
        "updatedAt": "2025-01-16T15:08:06.375",
        "categoryId": "18971bbb-5e8f-4c1e-8306-82a5e7e927b2",
        "description": "Cold Brewed Coffee with Ice (22oz)",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "name": "Fruit Soda",
        "imageUrl": "/images/products/fruit-soda.png",
        "basePrice": 0,
        "createdAt": "2025-01-16T15:08:05.878",
        "updatedAt": "2025-01-17T07:46:40.426",
        "categoryId": "18971bbb-5e8f-4c1e-8306-82a5e7e927b2",
        "description": "Refreshing Fruit-flavored Soda",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "26c9a62e-6ae1-4dda-b0c8-adea3642d6b9",
        "name": "Lugaw",
        "imageUrl": "/images/products/lugaw.png",
        "basePrice": 20,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Filipino Rice Porridge",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "ec13a3c0-c1f8-4e45-99ec-ac4438a0f328",
        "name": "Hot Coffee",
        "imageUrl": "/images/products/hot-coffee.png",
        "basePrice": 15,
        "createdAt": "2025-01-16T15:08:06.376",
        "updatedAt": "2025-01-17T07:47:18.931",
        "categoryId": "18971bbb-5e8f-4c1e-8306-82a5e7e927b2",
        "description": "Hot Brewed Coffee",
        "isAvailable": true,
        "allowsAddons": false
      },
      {
        "id": "e502fbec-f6f2-4524-b371-fea28ee60053",
        "name": "Goto",
        "imageUrl": "/images/products/goto.png",
        "basePrice": 35,
        "createdAt": "2025-01-16T15:08:03.771",
        "updatedAt": "2025-01-16T15:08:03.771",
        "categoryId": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "description": "Rice Porridge with Beef Tripe",
        "isAvailable": true,
        "allowsAddons": false
      }
    ],
    "Category": [
      {
        "id": "43f716fb-536b-491d-bacd-efe88594821b",
        "name": "Budget Meals",
        "imageUrl": "/images/categories/budget-meals.png",
        "createdAt": "2025-01-16T15:07:58.66",
        "sortOrder": 1,
        "updatedAt": "2025-01-16T15:07:58.66",
        "description": "Affordable meal options for everyone"
      },
      {
        "id": "9b5deffc-cbe2-4ca7-81b6-c49a3ee40e46",
        "name": "Silog Meals",
        "imageUrl": "/images/categories/silog-meals.png",
        "createdAt": "2025-01-16T15:07:58.66",
        "sortOrder": 3,
        "updatedAt": "2025-01-17T09:11:21.48",
        "description": "Filipino breakfast combinations with rice and egg"
      },
      {
        "id": "7706e5dd-a1fb-481c-8b27-8b3bb4db410a",
        "name": "Ala Carte",
        "imageUrl": "/images/categories/ala-carte.png",
        "createdAt": "2025-01-16T15:07:58.66",
        "sortOrder": 4,
        "updatedAt": "2025-01-17T09:11:26.395",
        "description": "Individual dishes and snacks"
      },
      {
        "id": "18971bbb-5e8f-4c1e-8306-82a5e7e927b2",
        "name": "Beverages",
        "imageUrl": "/images/categories/beverages.png",
        "createdAt": "2025-01-16T15:07:58.66",
        "sortOrder": 5,
        "updatedAt": "2025-01-30T10:45:13.676",
        "description": "Refreshing drinks and beverages"
      }
    ],
    "OrderItem": [],
    "GlobalAddon": [
      {
        "id": "57eef67b-e6d5-4340-b97c-0b426ffdb14a",
        "name": "Extra Shanghai",
        "price": 5,
        "createdAt": "2025-01-16T15:08:08.584",
        "updatedAt": "2025-01-16T15:08:08.584",
        "isAvailable": true
      },
      {
        "id": "ba5add9c-8271-468f-bf1c-e24ecad0a19a",
        "name": "Extra Egg",
        "price": 15,
        "createdAt": "2025-01-16T15:08:08.584",
        "updatedAt": "2025-01-16T15:08:08.584",
        "isAvailable": true
      },
      {
        "id": "dc97ff7e-9da4-487f-8310-1d1ab435f7de",
        "name": "Extra Sauce",
        "price": 5,
        "createdAt": "2025-01-16T15:08:08.584",
        "updatedAt": "2025-01-16T15:08:08.584",
        "isAvailable": true
      },
      {
        "id": "61532410-8f61-4fed-99cf-ca659539730d",
        "name": "Extra Siomai",
        "price": 5,
        "createdAt": "2025-01-16T15:08:08.584",
        "updatedAt": "2025-01-16T15:08:08.584",
        "isAvailable": true
      },
      {
        "id": "6bb9894e-4bba-4e5f-bf22-7be157d9b05c",
        "name": "Extra Hotdog",
        "price": 15,
        "createdAt": "2025-01-16T15:08:08.584",
        "updatedAt": "2025-01-16T15:08:08.584",
        "isAvailable": true
      },
      {
        "id": "f82e5959-b38b-4eee-9ef7-08b7bc71f8b7",
        "name": "Extra Skinless",
        "price": 10,
        "createdAt": "2025-01-16T15:08:08.584",
        "updatedAt": "2025-01-16T15:08:08.584",
        "isAvailable": true
      }
    ],
    "OrderItemAddon": [],
    "ProductVariant": [
      {
        "id": "b547aecf-359c-42eb-b524-f64c7a6ea321",
        "name": "Lychee 22oz",
        "type": "SIZE",
        "price": 39,
        "stock": 0,
        "imageUrl": null,
        "createdAt": "2025-02-05T14:25:06.198",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-02-05T14:38:42.09",
        "isAvailable": true
      },
      {
        "id": "06aeea79-2ae8-4122-b949-1fdea0d3d5c4",
        "name": "Blueberry 16oz",
        "type": "FLAVOR",
        "price": 29,
        "stock": 99,
        "imageUrl": "/images/variants/blueberry-16oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:41:53.568",
        "isAvailable": true
      },
      {
        "id": "36c27d2e-5881-4902-a9f4-dfe6d506d29e",
        "name": "Lemon 16oz",
        "type": "FLAVOR",
        "price": 29,
        "stock": 99,
        "imageUrl": "/images/variants/lemon-16oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:11.385",
        "isAvailable": true
      },
      {
        "id": "46f638fa-bb5a-466d-abd0-1ee3c0e9be7b",
        "name": "Beef",
        "type": "FLAVOR",
        "price": 5,
        "stock": 99,
        "imageUrl": null,
        "createdAt": "2025-01-16T15:08:04.881",
        "productId": "ab544d61-c698-42a8-af55-ee72435c0e0b",
        "updatedAt": "2025-01-16T15:08:04.881",
        "isAvailable": true
      },
      {
        "id": "5f4957b7-be82-4492-94d2-e6b65059f04d",
        "name": "Chocolate",
        "type": "FLAVOR",
        "price": 15,
        "stock": 99,
        "imageUrl": null,
        "createdAt": "2025-01-16T15:08:04.386",
        "productId": "fa6e8087-fe7e-4136-ae58-8d067a44830f",
        "updatedAt": "2025-01-16T15:08:04.386",
        "isAvailable": true
      },
      {
        "id": "6680f1e7-d0f8-4c62-925f-6f8902d13e7c",
        "name": "Chicken",
        "type": "FLAVOR",
        "price": 5,
        "stock": 99,
        "imageUrl": "/images/variants/siomai-chicken.png",
        "createdAt": "2025-01-16T15:08:04.881",
        "productId": "ab544d61-c698-42a8-af55-ee72435c0e0b",
        "updatedAt": "2025-01-16T15:08:04.881",
        "isAvailable": true
      },
      {
        "id": "6e3d35c2-e117-4de2-a6fd-e903ea49fd72",
        "name": "Cheese",
        "type": "FLAVOR",
        "price": 15,
        "stock": 99,
        "imageUrl": null,
        "createdAt": "2025-01-16T15:08:04.387",
        "productId": "fa6e8087-fe7e-4136-ae58-8d067a44830f",
        "updatedAt": "2025-01-16T15:08:04.387",
        "isAvailable": true
      },
      {
        "id": "6e6af4aa-f98f-44f0-8e09-7bee95e196fa",
        "name": "Green Apple 16oz",
        "type": "FLAVOR",
        "price": 29,
        "stock": 99,
        "imageUrl": "/images/variants/greenapple-16oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:25.19",
        "isAvailable": true
      },
      {
        "id": "70758ce0-ce59-4bb3-a1a9-59e0706c2f74",
        "name": "Hotdog",
        "type": "FLAVOR",
        "price": 15,
        "stock": 99,
        "imageUrl": null,
        "createdAt": "2025-01-16T15:08:04.387",
        "productId": "fa6e8087-fe7e-4136-ae58-8d067a44830f",
        "updatedAt": "2025-01-16T15:08:04.387",
        "isAvailable": true
      },
      {
        "id": "7cfbb69e-91f2-4db9-a916-5860110e4c70",
        "name": "22oz",
        "type": "SIZE",
        "price": 39,
        "stock": 99,
        "imageUrl": null,
        "createdAt": "2025-01-16T15:08:06.901",
        "productId": "e5375186-36c7-4842-8b75-2c5a00048d10",
        "updatedAt": "2025-01-16T15:08:06.901",
        "isAvailable": true
      },
      {
        "id": "7fcf8a06-c6ec-41a2-9700-447a0a5897a0",
        "name": "Green Apple 22oz",
        "type": "FLAVOR",
        "price": 39,
        "stock": 99,
        "imageUrl": "/images/variants/greenapple-22oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:30.439",
        "isAvailable": true
      },
      {
        "id": "8cf8435c-679b-480f-9fe7-3a1d866e6a13",
        "name": "Blueberry 22oz",
        "type": "FLAVOR",
        "price": 39,
        "stock": 99,
        "imageUrl": "/images/variants/blueberry-22oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:11.937",
        "isAvailable": true
      },
      {
        "id": "a0ad5694-e573-4170-8e68-9caa477a9d8b",
        "name": "Lychee 16oz",
        "type": "FLAVOR",
        "price": 29,
        "stock": 99,
        "imageUrl": "/images/variants/lychee-16oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:15.157",
        "isAvailable": true
      },
      {
        "id": "a30741c2-d73d-499f-b3d5-aa8d61343285",
        "name": "Strawberry 16oz",
        "type": "FLAVOR",
        "price": 29,
        "stock": 99,
        "imageUrl": "/images/variants/strawberry-16oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:23.546",
        "isAvailable": true
      },
      {
        "id": "e734f306-5b62-4f7d-8d1e-c0a6588f1f8b",
        "name": "Lemonade 22oz",
        "type": "FLAVOR",
        "price": 39,
        "stock": 99,
        "imageUrl": "/images/variants/lemon-22oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:33.405",
        "isAvailable": true
      },
      {
        "id": "ed02a20a-601b-4629-a302-5d50b20e9fdc",
        "name": "Strawberry 22oz",
        "type": "FLAVOR",
        "price": 39,
        "stock": 96,
        "imageUrl": "/images/variants/strawberry-22oz.png",
        "createdAt": "2025-01-16T15:08:07.395",
        "productId": "9d5cde11-1bcf-42c5-b9d9-41c78b43b5f0",
        "updatedAt": "2025-01-29T08:42:05.343",
        "isAvailable": true
      },
      {
        "id": "f8455e1e-73da-4a1f-a952-b8e3f730ecd3",
        "name": "16oz",
        "type": "SIZE",
        "price": 29,
        "stock": 99,
        "imageUrl": "/images/variants/coke-float-16oz.png",
        "createdAt": "2025-01-16T15:08:06.901",
        "productId": "e5375186-36c7-4842-8b75-2c5a00048d10",
        "updatedAt": "2025-01-16T15:08:06.901",
        "isAvailable": true
      }
    ]
  }
}
