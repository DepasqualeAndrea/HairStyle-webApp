import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/booking';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag, Plus, Check } from 'lucide-react-native';
import { useState } from 'react';

export default function ShopScreen() {
  const { products, loading, error } = useProducts();
  const { products: cartProducts, addProduct, removeProduct } = useCartStore();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const isInCart = (productId: string) => {
    return cartProducts.some((item) => item.id === productId);
  };

  const handleAddToCart = (product: any) => {
    addProduct(product);
    setAddedProducts((prev) => new Set(prev).add(product.id));

    // Reset animation after 2 seconds
    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeProduct(productId);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#FF4D6D" />
        <Text className="text-text-secondary mt-4">Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center px-6">
        <Text className="text-h3 text-text-primary mb-2">⚠️ Error</Text>
        <Text className="text-text-secondary text-center">{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      {/* Header */}
      <View className="px-6 py-4 border-b border-bg-tertiary">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-h2 text-text-primary font-bold">Shop</Text>
            <Text className="text-text-secondary mt-1">Premium Hair Care Products</Text>
          </View>
          <View className="relative">
            <ShoppingBag size={28} color="#FF4D6D" />
            {cartProducts.length > 0 && (
              <View className="absolute -top-2 -right-2 bg-accent-pink h-5 w-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{cartProducts.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-h3 text-text-primary mb-2">📦 No Products</Text>
          <Text className="text-text-secondary text-center">
            Products will be available soon. Check back later!
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const inCart = isInCart(item.id);
            const justAdded = addedProducts.has(item.id);

            return (
              <Card variant="glass" className="mb-4 overflow-hidden">
                {/* Product Image */}
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    className="w-full h-48 bg-bg-tertiary"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-48 bg-bg-tertiary items-center justify-center">
                    <ShoppingBag size={48} color="#64748B" />
                  </View>
                )}

                {/* Product Info */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-3">
                      <Text className="text-text-primary text-lg font-bold" numberOfLines={2}>
                        {item.name}
                      </Text>
                      {item.description && (
                        <Text className="text-text-secondary text-sm mt-1" numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {item.stock_qty !== undefined && item.stock_qty < 10 && item.stock_qty > 0 && (
                      <Badge label={`Only ${item.stock_qty} left`} variant="primary" size="sm" />
                    )}
                  </View>

                  {/* Price and Action */}
                  <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-accent-pink text-2xl font-bold">
                      {formatPrice(item.price)}
                    </Text>

                    {!inCart ? (
                      <TouchableOpacity
                        onPress={() => handleAddToCart(item)}
                        disabled={item.stock_qty === 0}
                        className={`flex-row items-center px-5 py-3 rounded-full ${
                          item.stock_qty === 0 ? 'bg-bg-tertiary' : 'bg-accent-pink'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check size={18} color="white" strokeWidth={3} />
                            <Text className="text-white font-bold ml-2">Added!</Text>
                          </>
                        ) : (
                          <>
                            <Plus size={18} color="white" strokeWidth={3} />
                            <Text className="text-white font-bold ml-2">
                              {item.stock_qty === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleRemoveFromCart(item.id)}
                        className="flex-row items-center px-5 py-3 rounded-full border-2 border-accent-pink"
                      >
                        <Check size={18} color="#FF4D6D" strokeWidth={3} />
                        <Text className="text-accent-pink font-bold ml-2">In Cart</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
