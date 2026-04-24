self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/videos.html",
        "destination": "/videos"
      },
      {
        "source": "/courses.html",
        "destination": "/courses"
      },
      {
        "source": "/groups.html",
        "destination": "/groups"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()