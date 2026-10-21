export const productFragment = `
  fragment productFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const getProductsQuery = `
  query getProducts($query: String, $first: Int = 250, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...productFields
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductByHandleQuery = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...productFields
    }
  }
  ${productFragment}
`;

export const getCollectionsQuery = `
  query getCollections($first: Int = 50) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          image {
            url
            altText
            width
            height
          }
          products(first: 50) {
            edges {
              node {
                ...productFields
              }
            }
          }
        }
      }
    }
  }
  ${productFragment}
`;
