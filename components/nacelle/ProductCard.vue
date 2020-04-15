<template>
  <div class="product-card nacelle">
    <router-link :to="`${pathFragment}${product.handle}`">
      <product-image :source="mediaSrc" />
    </router-link>
    <div class="product-card-details">
      <router-link :to="`${pathFragment}${product.handle}`">
        <product-title :title="product.title" />
      </router-link>
      <product-price :price="product.priceRange.max" />
    </div>
    <div v-if="product && product.id" class="product-card-actions">
      <button
        @click.prevent="activateQuickShop"
        class="button is-primary nacelle"
      >
        Quick Shop
      </button>
      <interface-modal
        :modalOpen="optionsModalVisible"
        v-on:closeModal="optionsModalVisible = false"
      >
        <product-details
          :product="product"
          :deactivateQuickShop="deactivateQuickShop"
        />
      </interface-modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import ProductImage from '~/components/nacelle/ProductImage'
import ProductTitle from '~/components/nacelle/ProductTitle'
import ProductPrice from '~/components/nacelle/ProductPrice'
import InterfaceModal from '~/components/nacelle/InterfaceModal'
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'
import ProductDetails from '~/components/nacelle/ProductDetails'

export default {
  components: {
    ProductImage,
    ProductTitle,
    ProductPrice,
    InterfaceModal,
    ProductDetails
  },
  mixins: [allOptionsSelected, availableOptions],
  props: {
    pathFragment: {
      type: String,
      default: '/products/'
    },
    product: {
      type: Object,
      default: () => {
        return {
          priceRange: {
            min: '0.0',
            max: '0.00'
          },
          title: null,
          featuredMedia: {
            src: undefined
          },
          id: null,
          handle: '',
          variants: []
        }
      }
    },
    variant: {
      type: Object
    },
    showQuantityUpdate: {
      type: Boolean,
      default: true
    },
    showAddToCart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      optionsModalVisible: false,
      confirmedSelection: false,
      quantity: 0,
      test: false
    }
  },
  watch: {
    quantityTotal() {
      this.confirmedSelection = false
    },
    optionsModalVisible(previous, current) {
      if (!previous && current) {
        this.test = true
        this.productView(this.product)
      }
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),
    ...mapGetters('cart', ['quantityTotal']),

    currentVariant() {
      if (this.product.variants && this.product.variants.length == 1) {
        return this.product.variants[0]
      } else {
        return this.selectedVariant
      }
    },
    currentVariantId() {
      if (this.currentVariant && this.currentVariant.id) {
        return this.currentVariant.id
      }

      return undefined
    },
    mediaSrc() {
      if (
        this.product &&
        this.product.featuredMedia &&
        this.product.featuredMedia.src
      ) {
        return this.product.featuredMedia.src
      }

      return undefined
    },
    cartProduct() {
      return {
        image: this.product.featuredMedia,
        title: this.product.title,
        productId: this.product.id,
        price: this.currentPrice,
        handle: this.product.handle,
        variant: this.currentVariant
      }
    },
    productLineItems() {
      const vm = this
      return this.lineItems.filter(item => {
        return item.productId == vm.product.id
      })
    },
    onlyOneOption() {
      if (
        this.allOptions &&
        this.allOptions.length == 1 &&
        this.allOptions[0].values.length == 1
      ) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView']),
    activateQuickShop() {
      this.optionsModalVisible = true
    },
    deactivateQuickShop() {
      this.optionsModalVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card-details,
.product-card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
}

.product-card-details /deep/ a {
  flex-basis: 80%;
}

.handler {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
