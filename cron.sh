#!/bin/bash
while true
do
    heroku run python sendsms.py
    sleep 60
done

