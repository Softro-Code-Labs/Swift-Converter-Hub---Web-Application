export const ADSENSE = {
  PUBLISHER_ID: 'ca-pub-5253953210780850',
  SLOTS: {
    TOP: '5564225975',
    LEFT: '1085924913',
    RIGHT: '9067185857',
    BOTTOM: '5372654282',
    /** Blog posts: in-article (fluid) unit, mid-article. AdSense: Swift_Blog_InArticle. */
    BLOG_IN_ARTICLE: '6027808485',
    /** Blog posts: responsive display unit, end of article. AdSense: Swift_Blog_End. */
    BLOG_END: '1134574458',
  },
  ADS_ENABLED: process.env.NEXT_PUBLIC_ADS_ENABLED !== 'false',
} as const;
