# andasy.hcl app configuration file generated for codemande-academy-fn on Tuesday, 10-Feb-26 11:09:00 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "codemande-academy-fn"

app {

  env = {
    HOST = "::"
  }

  port = 8080

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "codemande-academy-fn"
  }

}
