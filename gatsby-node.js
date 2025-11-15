const path = require("path")

// Define Sanity schema types for fields that may not exist yet
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    type SanityEstablishment implements Node {
      location: SanityLocation
    }

    type SanityLocation {
      lat: Float
      lng: Float
    }
  `

  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Query all establishments from Sanity
  const result = await graphql(`
    query {
      allSanityEstablishment(
        filter: { _id: { ne: "b95f53fc-ae57-4605-b4b6-6ceb785a1756" } }
      ) {
        nodes {
          _id
          name
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const establishments = result.data.allSanityEstablishment.nodes

  // Create a page for each establishment
  establishments.forEach(establishment => {
    // Create a URL-friendly slug from the name
    const slug = establishment.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    createPage({
      path: `/establishment/${slug}`,
      component: path.resolve("./src/templates/establishment.jsx"),
      context: {
        id: establishment._id,
      },
    })
  })
}
