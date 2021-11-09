# First stage of the build (compile and build the application)
FROM maven:3.6-adoptopenjdk-11 AS MAVEN_BUILD

# Install most basic application dependencies
RUN apt-get update -qq \
    && dpkg --add-architecture i386 \
    && apt-get update \
	&& apt-get install -yq --no-install-recommends \
		git

RUN git clone https://github.com/edson-a-soares/msa-nose.git
RUN cd msa-nose && mvn clean package

FROM openjdk:11-jre-slim

# Install most basic application dependencies
RUN apt-get update -qq \
    && dpkg --add-architecture i386 \
    && apt-get update \
	&& apt-get install -yq --no-install-recommends \
		curl

COPY --from=MAVEN_BUILD msa-nose/target/msa-nose-0.0.1.jar /usr/local/msa-nose/

COPY src/scripts/start_msanose.sh /usr/local/msa-nose/start_msanose.sh
RUN chmod u+x /usr/local/msa-nose/start_msanose.sh

COPY src/scripts/entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
