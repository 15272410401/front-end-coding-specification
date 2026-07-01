#!/usr/bin/env sh

# 抛出异常信息
set -e

push_addr=`git remote get-url --push origin`
commit_info=`git describe --all --always --long`
dist_path=docs\.vitepress\dist
push_branch=gh-pages

# 生成静态资源站点
npm run docs:build

cd $dist_path

git init
git add -A
git commit -m deploy:$commit_info
git push -f $push_addr HEAD:$push_branch

cd -
rm -rf $dist_path