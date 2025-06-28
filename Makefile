# Upload to AWS.
upload:
	@echo "Uploading to AWS S3..."
	@aws s3 cp --recursive --exclude ".git/*" --exclude "Makefile" . s3://james-salvatore-apps/
	@echo "Upload complete."