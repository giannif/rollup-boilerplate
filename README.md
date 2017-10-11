### dev 
 - `npm run start` to run [serve](https://github.com/zeit/serve)
 - `npm run dev` to run rollup with the `-w` watch flag
 - Change code, refresh the browser 

 ### deploy
 Deployment is automatically done by Travis using tags. To deploy a new script, simply create a tag, push it, and when the build is done you will be able to see it at `https://s3Domain/s3Bucket/tag-name/bundle.js`.

You can use a `latest` tag for distribution if you'd like. To re-deploy to this tag, delete the tag, recreate, and push to master. The latest bundle will then be updated and the cache cleared.

 ### re-deploying a tag
 - `git -d tag TAG_NAME`
 - `git push origin :refs/tags/TAG_NAME`
 - `git tag TAG_NAME`
 - `git push --tags`
