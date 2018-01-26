MINI DNS
===

A simple and mini DNS Server for nodejs

## Installation
	npm i -g mini-dns-server

## Configuration

### Add router

	dns add -i 127.0.0.1 -d www.xxx.com

### Reset router

	dns reset

### Change upstream dns server

	dns upstream -i 8.8.8.8

## Usage

	sudo dns start