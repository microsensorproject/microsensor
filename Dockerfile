FROM openjdk:11-jre-slim

# Install most basic application dependencies
RUN apt-get update -qq \
    && dpkg --add-architecture i386 \
    && apt-get update \
	&& apt-get install -yq --no-install-recommends \
		curl

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
