#!/bin/sh

# Author:	Ethan Quach
# Copyright (c) 2021 Apple, Inc. All rights reserved.


usage() {
	echo "Usage: $0 [-b <branch-to-squash>] [-p <parent>] [-m <commit-msg>]" 1>&2
	echo 1>&2
	echo "	-b <branch-to-squash>	: Branch to squash.  Defaults to current branch." 1>&2
	echo "	-p <parent>		: Parent branch of branch-to-squash.  Defaults to default branch of repo." 1>&2
	echo "	-m \"<commit-msg>\"	: Commit message for final commit.  Defaults to interactive." 1>&2
	echo 1>&2
	exit 1
}

BRANCH=
PARENT=
MSG=

while getopts ":b:m:p:" opt; do
	case ${opt} in
		b)	BRANCH=${OPTARG}
			;;
		m)	MSG=${OPTARG}
			;;
		p)	PARENT=${OPTARG}
			;;
		*)
			usage
			;;
	esac
done

if [ -z "$BRANCH" ]; then
	BRANCH=`git branch --show-current`
	if [ $? != 0 ]; then
		echo
		echo "ERROR: Current directory does not appear to be a GIT repository."
		exit 1
	fi
fi

if [ -z "$PARENT" ]; then
	REMOTE_URL=`git config --local --get remote.origin.url`
	if [ $? != 0 ]; then
		echo
		echo "ERROR: Current directory does not appear to be a GIT repository."
		exit 1
	fi
	PARENT=`git remote show ${REMOTE_URL} | grep "HEAD branch" | awk ' { print $3 } '`
	if [ -z "$PARENT" ]; then
		echo
		echo "ERROR: Failed to get default branch"
		exit 1
	fi
fi

BRANCH_ORIG=${BRANCH}.orig.$$


echo "##############################"
echo "Branch to squash: $BRANCH"
echo "Parent of Branch: $PARENT"
if [ -z "$MSG" ]; then
	echo "Commit Message:   <Interactive commit>"
else
	echo "Commit Message:   \"$MSG\""
fi
echo
echo "NOTE: Original branch '$BRANCH' will be saved off locally as '$BRANCH_ORIG'"
echo "##############################"

echo
read -p "Ready to proceed? [y\N]" proceed
if [[ "$proceed" = "y" ]] || [[ "$proceed" = "Y" ]] ; then
	echo
	echo "Proceeding..."
else
	echo
	echo "Aborting..."
	exit 0
fi
echo


git checkout $BRANCH
if [ $? != 0 ]; then
	echo
	echo "ERROR: failed to checkout $BRANCH"
	exit 1
fi

git merge $PARENT -m "Merge with '$PARENT'"
if [ $? != 0 ]; then
	echo
	echo "ERROR: failed to merge with parent '$PARENT'"
	exit 1
fi

git branch -m $BRANCH_ORIG
if [ $? != 0 ]; then
	echo
	echo "ERROR: failed to rename branch '$BRANCH' to '$BRANCE_ORIG'"
	exit 1
fi

git checkout $PARENT
if [ $? != 0 ]; then
	echo
	echo "ERROR: failed to checkout '$PARENT' branch"
	exit 1
fi

git checkout -b $BRANCH
if [ $? != 0 ];then
	echo
	echo "ERROR: failed to create new branch '$BRANCH'"
	exit 1
fi

git merge --squash $BRANCH_ORIG
if [ $? != 0 ] ; then
	echo
	echo "ERROR: failed to merge '$BRANCH_ORIG' into '$BRANCH'"
	exit 1
fi

if [ -z "$MSG" ]; then
	git commit
else
	git commit -m "$MSG"
fi
if [ $? != 0 ]; then
	echo
	echo "ERROR: failed to commit in new branch"
	exit 1
fi

echo "SUCCESS: created new merge-squashed branch '$BRANCH' with a single commit!"
echo
echo "If this branch already exists remotely, you may have to force push it with:"
echo
echo "	git push --set-upstream origin $BRANCH -f"
echo

exit 0

