# andasy.hcl app configuration file generated for codemande-academy-bn on Tuesday, 10-Feb-26 10:54:29 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "codemande-academy-bn"

app {

  env = {}

  port = 4000

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "codemande-academy-bn"
  }

}
