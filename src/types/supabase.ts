export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          parent_id: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          parent_id?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      products: {
        Row: {
          brand: string;
          category_id: string;
          created_at: string;
          description: string;
          featured: boolean;
          id: string;
          is_active: boolean;
          price: number;
          rating: number;
          review_count: number;
          sale_price: number | null;
          sku: string;
          slug: string;
          stock: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          brand: string;
          category_id: string;
          created_at?: string;
          description: string;
          featured?: boolean;
          id?: string;
          is_active?: boolean;
          price: number;
          rating?: number;
          review_count?: number;
          sale_price?: number | null;
          sku: string;
          slug: string;
          stock?: number;
          title: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_images: {
        Row: {
          alt: string;
          id: string;
          position: number;
          product_id: string;
          url: string;
        };
        Insert: {
          alt: string;
          id?: string;
          position?: number;
          product_id: string;
          url: string;
        };
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>;
      };
      banners: {
        Row: {
          id: string;
          image_url: string;
          is_active: boolean;
          link_url: string;
          position: number;
          subtitle: string;
          title: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          is_active?: boolean;
          link_url: string;
          position?: number;
          subtitle: string;
          title: string;
        };
        Update: Partial<Database['public']['Tables']['banners']['Insert']>;
      };
      coupons: {
        Row: {
          code: string;
          description: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          max_uses: number;
          min_order_value: number;
          used_count: number;
        };
        Insert: {
          code: string;
          description: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number;
          min_order_value?: number;
          used_count?: number;
        };
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>;
      };
      reviews: {
        Row: {
          comment: string;
          created_at: string;
          id: string;
          is_verified: boolean;
          product_id: string;
          rating: number;
          title: string;
          user_id: string;
          user_name: string;
        };
        Insert: {
          comment: string;
          created_at?: string;
          id?: string;
          is_verified?: boolean;
          product_id: string;
          rating: number;
          title: string;
          user_id: string;
          user_name: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      orders: {
        Row: {
          coupon_code: string | null;
          created_at: string;
          discount: number;
          id: string;
          notes: string;
          payment_method: string;
          payment_status: string;
          shipping: number;
          shipping_address: Json;
          status: string;
          subtotal: number;
          total: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          coupon_code?: string | null;
          created_at?: string;
          discount?: number;
          id?: string;
          notes?: string;
          payment_method: string;
          payment_status: string;
          shipping?: number;
          shipping_address: Json;
          status: string;
          subtotal: number;
          total: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          price: number;
          product_id: string;
          quantity: number;
          total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          price: number;
          product_id: string;
          quantity: number;
          total: number;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
          role: 'admin' | 'staff' | 'customer';
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          phone?: string | null;
          role?: 'admin' | 'staff' | 'customer';
          username: string;
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
    };
  };
};
